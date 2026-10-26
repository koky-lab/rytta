/* One shared campaign. Pending requests live only in memory until the server confirms. */
(() => {
  const $=id=>document.getElementById(id),{copy,sameCampaign,mergeCampaign}=RyttaSyncCore;
  let session=null,base=null,displayed=null,pending=null,inFlight=null,revision=0;
  let loaded=false,applying=false,sending=false,polling=false,connecting=false,paused=true,conflict=false,authNeeded=false,timer;
  const snapshot=data=>copy({...data,setups:state.setups});
  const editing=()=>['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)||!!document.querySelector('dialog[open]');
  function lock(value){paused=value;if($('appShell'))$('appShell').inert=value;document.documentElement.classList.toggle('shared-paused',value);if(!value)document.documentElement.classList.remove('shared-starting');}
  function status(message,error=false,label){
    for(const id of ['onlineStatus','resourceSyncStatus','sharedConnectionMessage'])if($(id)){$(id).textContent=message;$(id).classList.toggle('error',error);}
    if($('onlineSyncBadge')){$('onlineSyncBadge').hidden=false;$('onlineSyncBadge').textContent=label||(error?'Sin conexión':'Sincronizado');$('onlineSyncBadge').title=message;$('onlineSyncBadge').classList.toggle('error',error);}
    if(typeof updateSaveStatus==='function')updateSaveStatus(label||(error?'Sin conexión':'Sincronizado para todos'));
    if($('useServerVersionBtn'))$('useServerVersionBtn').hidden=!conflict;
  }
  async function api(path,method='GET',body){
    const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),15000);
    try{
      let response,value;try{response=await fetch(path,{method,cache:'no-store',credentials:'same-origin',signal:controller.signal,headers:method==='GET'?{}:{'Content-Type':'application/json','X-Rytta-Action':'1','X-CSRF-Token':session?.csrf||''},body:body===undefined?undefined:JSON.stringify(body)});value=await response.json();}
      catch{throw Object.assign(Error('No se ha podido contactar con el servidor.'),{network:true});}
      if(!response.ok)throw Object.assign(Error(value.error||'No se ha podido sincronizar.'),{status:response.status});return value;
    }finally{clearTimeout(timeout);}
  }
  async function refreshSession(){session=await api('/api/session');if(session.user?.role!=='dm')throw Object.assign(Error('Entra con la cuenta DM para continuar.'),{status:401});authNeeded=false;}
  function failed(error){
    authNeeded=error.status===401||error.status===403;conflict=!!error.conflict;lock(true);
    const reason=conflict?'Otro dispositivo ha cambiado el mismo dato. Carga la versión del servidor para continuar; el cambio sin enviar se descartará.':authNeeded?'La sesión ha caducado. Entra con tu cuenta DM en otra pestaña y pulsa «Reintentar conexión».':(pending||inFlight)?'Sin conexión. Hay cambios sin enviar: mantén esta pestaña abierta hasta que se confirme el guardado para todos.':'Sin conexión con la campaña compartida. La edición está bloqueada hasta recuperar el servidor.';
    status(reason,true,conflict?'Revisar cambio':authNeeded?'Iniciar sesión':'Sin conexión');
  }
  function applyRemote(campaign){
    applying=true;try{
      const module=state.activeModule,role=state.role,mapId=state.currentMapId,history=state.mapHistory,image=getActiveMap().image;
      const view={sidebarCollapsed:state.sidebarCollapsed,toolMode:state.toolMode,visibleLayers:copy(state.visibleLayers)};
      applyCampaignData({...copy(campaign),...view,role,currentMapId:mapId,mapHistory:history});
      state.setups=copy(campaign.setups||{});renderSetupOptions();
      if(getActiveMap().image!==image)applyMapImage({skipSave:true});else renderAll();
      setActiveModule(module,{skipSave:true});displayed=snapshot(getCampaignData());
    }finally{applying=false;}
  }
  function schedule(delay=200){clearTimeout(timer);timer=setTimeout(flush,delay);}
  async function flush(){
    if(!loaded||sending||conflict||!pending)return;
    sending=true;inFlight=pending;pending=null;let reconciled=false;
    try{
      for(let attempt=0;attempt<4;attempt++){
        try{
          status('Enviando los cambios a la campaña compartida…',false,'Guardando para todos…');
          const sent=inFlight,result=await api('/api/campaign','PUT',{revision,campaign:sent});base=sent;revision=result.revision;inFlight=null;
          if(pending&&sameCampaign(pending,base))pending=null;
          if(reconciled&&!pending)applyRemote(base);
          lock(false);status(pending?'Enviando los siguientes cambios…':'Campaña compartida · Guardado para todos.',false,pending?'Guardando para todos…':'Sincronizado');return;
        }catch(error){
          if(error.status!==409)throw error;
          const remote=await api('/api/state');if(!remote.campaign)throw error;
          inFlight=mergeCampaign(base,pending||inFlight,remote.campaign);pending=null;base=remote.campaign;revision=remote.revision;reconciled=true;
        }
      }
      throw Object.assign(Error('La mesa está ocupada.'),{network:true});
    }catch(error){pending=pending||inFlight;inFlight=null;failed(error);}
    finally{sending=false;if(pending&&!conflict&&!authNeeded)schedule(2000);}
  }
  async function readShared(force=false){
    if(polling||sending||document.hidden&&!force)return;
    if(pending){await flush();return;}if(!force&&!paused&&editing())return;
    polling=true;try{
      const remote=await api('/api/state');if(pending||sending)return;
      if(!loaded||remote.revision!==revision||paused){base=remote.campaign||snapshot(getCampaignData());revision=remote.revision;applyRemote(base);loaded=true;}
      lock(false);status('Campaña compartida · Guardado para todos.',false,'Sincronizado');
    }catch(error){failed(error);}finally{polling=false;}
  }
  async function reconnect(){
    if(connecting||sending||polling)return;connecting=true;
    try{
      await window.ryttaAppReady;await refreshSession();
      if(conflict){failed(Object.assign(Error('Conflicto de edición.'),{conflict:true}));return;}
      if(pending)await flush();else await readShared(true);
    }catch(error){failed(error);}finally{connecting=false;}
  }
  window.ryttaOnline={
    onSave(data){
      if(applying)return;
      if(!loaded){status('Cargando la campaña del servidor…',false,'Conectando…');return;}
      const next=snapshot(data),desired=pending||inFlight||base;
      try{
        const merged=mergeCampaign(displayed,next,desired);displayed=next;if(sameCampaign(merged,desired))return;
        pending=merged;status('Enviando los cambios a la campaña compartida…',false,'Guardando para todos…');if(!conflict&&!authNeeded)schedule();
      }catch(error){pending=next;failed(error);}
    },
    exportCampaign(){
      (async()=>{if(pending)await flush();if(pending||conflict)throw Error('Espera a que se guarden los cambios antes de exportar.');const data=await api('/api/export'),link=document.createElement('a'),url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));link.href=url;link.download='campana-rytta-compartida.json';link.click();URL.revokeObjectURL(url);})().catch(failed);return true;
    },
  };
  for(const id of ['syncResourcesBtn','shareOnlineBtn','openOnlineBtn','retrySharedBtn'])if($(id))$(id).onclick=reconnect;
  if($('useServerVersionBtn'))$('useServerVersionBtn').onclick=async()=>{if(sending||!confirm('¿Cargar la versión compartida y descartar este cambio sin enviar?'))return;clearTimeout(timer);pending=null;inFlight=null;conflict=false;await reconnect();};
  const wake=()=>{if(paused||authNeeded||!loaded)reconnect();else if(pending)flush();else readShared();};
  setInterval(wake,2000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)wake();});window.addEventListener('focus',wake);window.addEventListener('online',wake);
  window.addEventListener('offline',()=>failed(Object.assign(Error('Sin conexión.'),{network:true})));
  window.addEventListener('beforeunload',event=>{if(pending||inFlight){event.preventDefault();event.returnValue='';}});
  lock(true);status('Cargando la campaña del servidor…',false,'Conectando…');reconnect();
})();
