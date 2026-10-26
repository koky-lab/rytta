/* Shared campaign reconciliation. No credentials or browser persistence here. */
(() => {
  const copy=value=>value===undefined?undefined:JSON.parse(JSON.stringify(value));
  const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
  const viewKeys=new Set(['savedAt','role','currentMapId','mapHistory','sidebarCollapsed','routeMode','toolMode','activeTerrain','activeSavedRoute','showSavedRoutes','measureRoute','visibleLayers']);
  function content(c){const value=copy(c);if(!value)return value;for(const key of viewKeys)delete value[key];for(const actor of value.resources?.actors||[])delete actor.inventoryOpen;return value;}
  const missing=Symbol('missing');
  const object=v=>v!==null&&v!==missing&&typeof v==='object'&&!Array.isArray(v);
  const same=(a,b)=>a===missing||b===missing?a===b:equal(a,b);
  const clone=v=>v===missing?missing:copy(v);
  function conflict(path){throw Object.assign(new Error('Dos dispositivos han modificado el mismo dato: '+path),{conflict:true,path});}
  function merge(base,local,remote,path){
    if(same(local,base))return clone(remote);
    if(same(remote,base)||same(local,remote))return clone(local);
    if(object(base)&&object(local)&&object(remote)){
      const result={};for(const key of new Set([...Object.keys(base),...Object.keys(local),...Object.keys(remote)])){
        const value=merge(Object.hasOwn(base,key)?base[key]:missing,Object.hasOwn(local,key)?local[key]:missing,Object.hasOwn(remote,key)?remote[key]:missing,path+'.'+key);
        if(value!==missing)result[key]=value;
      }return result;
    }
    if(Array.isArray(base)&&Array.isArray(local)&&Array.isArray(remote)){
      const arrays=[base,local,remote];
      if(arrays.every(a=>a.every(v=>object(v)&&typeof v.id==='string')&&new Set(a.map(v=>v.id)).size===a.length)){
        const maps=arrays.map(a=>new Map(a.map(v=>[v.id,v]))),result=[];
        for(const id of new Set([...remote.map(v=>v.id),...local.map(v=>v.id),...base.map(v=>v.id)])){
          const value=merge(...maps.map(m=>m.has(id)?m.get(id):missing),path+'['+id+']');if(value!==missing)result.push(value);
        }return result;
      }
    }
    return conflict(path);
  }
  function mergeCampaign(base,local,remote){
    // A screenshot recovery can represent the same increase still queued in an older DM tab.
    // Different movement IDs are not evidence of two intended rewards: require review.
    const known=new Set((base.resources?.entries||[]).map(e=>e.id));
    const recovered=(remote.resources?.entries||[]).filter(e=>!known.has(e.id)&&e.type==='coin'&&/aumento de monedas del dm recuperado de la captura/i.test(e.note||''));
    for(const entry of local.resources?.entries||[])if(!known.has(entry.id)&&entry.type==='coin'&&recovered.some(r=>r.id!==entry.id&&r.actorId===entry.actorId&&r.quantity===entry.quantity))conflict('aumento de monedas ya recuperado; revisa la copia pendiente antes de reenviarla');
    const merged=merge(content(base),content(local),content(remote),'campaña'),result=copy(remote);
    for(const key of new Set([...Object.keys(result),...Object.keys(merged)]))if(!viewKeys.has(key)){if(Object.hasOwn(merged,key))result[key]=merged[key];else delete result[key];}
    result.savedAt=local.savedAt;
    const oldActors=new Set((base.resources?.actors||[]).map(a=>a.id)),actors=new Set((result.resources?.actors||[]).map(a=>a.id));
    for(const entry of result.resources?.entries||[])if(oldActors.has(entry.actorId)&&!actors.has(entry.actorId))conflict('personaje eliminado con movimientos pendientes');
    for(const actor of result.resources?.actors||[]){const view=local.resources?.actors.find(a=>a.id===actor.id);if(view&&Object.hasOwn(view,'inventoryOpen'))actor.inventoryOpen=view.inventoryOpen;}
    return result;
  }
  globalThis.RyttaSyncCore={copy,sameCampaign:(a,b)=>equal(content(a),content(b)),mergeCampaign};
})();
