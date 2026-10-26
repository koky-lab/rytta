'use strict';
(() => {
  const $ = id => document.getElementById(id);
  let session = null, shared = null, users = [], busy = false, polling = false, retry = null, selectedShop = '', search = '', resetUser = null;
  const node = (tag,value,className) => { const e=document.createElement(tag);if(value!==undefined)e.textContent=value;if(className)e.className=className;return e; };
  const button = (label,fn) => {const e=node('button',label,'secondary');e.type='button';e.onclick=fn;return e;};
  function message(value,error=false){for(const id of ['portalMessage',...($('passwordSection').open?['passwordMessage']:[])]){$(id).textContent=value;$(id).className='portal-message '+(error?'error':'success');}}
  async function api(path,method='GET',data) {
    const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),15000);
    try{
    let response;
    try { response=await fetch(path,{signal:controller.signal,method,cache:'no-store',credentials:'same-origin',headers:method==='GET'?{}:{'Content-Type':'application/json','X-Rytta-Action':'1','X-CSRF-Token':session?.csrf||''},body:data===undefined?undefined:JSON.stringify(data)}); }
    catch { throw Object.assign(new Error('No hay conexión. Comprueba Internet antes de reintentar.'),{network:true}); }
    let result;try{result=await response.json();}catch{throw Object.assign(new Error('No se ha recibido la confirmación. Reintenta la misma operación para consultar su resultado.'),{network:true});}if(!response.ok)throw Object.assign(new Error(result.error||'No se ha podido completar la operación.'),{status:response.status});return result;
    }finally{clearTimeout(timeout);}
  }
  function handle(error){message(error.message,true);if(error.status===401){session=null;shared=null;showSections();syncStatus('');}}
  async function run(fn){if(busy)return;busy=true;document.body.classList.add('portal-busy');try{await fn();}catch(e){handle(e);}finally{busy=false;document.body.classList.remove('portal-busy');}}
  function showSections(){const user=session?.user;
    document.body.classList.toggle('player-mode',user?.role==='player');
    if(!document.body.dataset.playerTab)document.body.dataset.playerTab='inventory';
    $('loginSection').hidden=!!user;$('dmSection').hidden=user?.role!=='dm';$('playerSection').hidden=user?.role!=='player';$('passwordSection').hidden=!user;$('logoutBtn').hidden=!user;$('refreshPortal').hidden=user?.role!=='dm';$('changePasswordBtn').hidden=!user;
    if(!user&&$('passwordSection').open)$('passwordSection').close();
    $('accountName').textContent=user?user.username+' · '+(user.role==='dm'?'DM':'Jugador'):'';$('accountName').title=$('accountName').textContent;
    const recovery=session?.ownerRecovery&&user?.role==='dm';$('currentPasswordLabel').hidden=!!recovery;$('currentPassword').required=!!user&&!recovery;
    $('passwordTitle').textContent=recovery?'Configurar mi contraseña de Rytta':'Cambiar mi contraseña';
    $('passwordHelp').textContent=recovery?'Tu identidad de propietario está verificada. Elige una contraseña para entrar con tu correo desde cualquier dispositivo.':'Al cambiarla se cerrarán tus sesiones en otros dispositivos.';
    if(user&&!session.passwordSet&&!$('passwordSection').open)$('passwordSection').showModal();
  }
  async function loadSession(){const previousId=session?.user?.id;session=await api('/api/session');if(previousId!==session.user?.id){retry=null;$('retryOperation').hidden=true;shared=null;}if(session.user)setAccessMode(false);showSections();if(session.user)await refresh();}
  function setAccessMode(register){
    $('loginForm').hidden=register;$('registerForm').hidden=!register;$('loginAccountHelp').hidden=register;
    $('showLogin').classList.toggle('active',!register);$('showRegister').classList.toggle('active',register);
    $('showLogin').setAttribute('aria-pressed',String(!register));$('showRegister').setAttribute('aria-pressed',String(register));
    $('loginTitle').textContent=register?'Elige tu personaje':'Entra en Rytta';
    $('loginHelp').textContent=register?'Crea tu cuenta para acceder a la mochila, recursos y compras de tu personaje.':'Tu personaje, tu mochila y las tiendas de la campaña, estés donde estés.';
  }
  async function loadAvailableCharacters(){
    const select=$('registerActor'),old=select.value;select.disabled=true;$('registerSubmit').disabled=true;
    $('registerAvailability').textContent='Buscando personajes disponibles…';
    const result=await api('/api/registration');select.replaceChildren();const first=node('option','Selecciona un personaje');first.value='';select.append(first);
    for(const actor of result.characters){const option=node('option',actor.name);option.value=actor.id;select.append(option);}
    if(result.characters.some(a=>a.id===old))select.value=old;
    select.disabled=!result.characters.length;$('registerSubmit').disabled=!result.characters.length;
    $('registerAvailability').textContent=result.characters.length?'Solo aparecen los personajes que aún no tienen cuenta.':'No hay personajes disponibles. Si ya tienes cuenta, entra; si necesitas un personaje, contacta con el DM.';
  }
  function formatGold(copper){return new Intl.NumberFormat('es-ES',{maximumFractionDigits:2}).format(copper/100)+' po';}
  function copper(entries){return entries.filter(e=>e.type==='coin').reduce((n,e)=>n+Math.round(e.quantity*100),0);}
  function totals(entries){const groups=new Map();for(const e of entries){const key=e.type+':'+e.name.trim().toLowerCase();const item=groups.get(key)||{name:e.name,type:e.type,quantity:0};item.quantity+=e.quantity;groups.set(key,item);}return [...groups.values()].filter(i=>i.quantity>0).sort((a,b)=>a.name.localeCompare(b.name,'es'));}
  async function refresh(){
    if(!session?.user)return;
    const userId=session.user.id,next=await api('/api/state'),old=shared;
    if(session?.user.id!==userId||(old&&next.revision<old.revision))return;shared=next;
    if(session.user.role==='dm'){users=(await api('/api/users')).users;renderDM();}
    else if(!old||old.revision!==next.revision)renderPlayer(JSON.stringify(old?.merchants)!==JSON.stringify(next.merchants));
    syncStatus('Sincronizado');
  }
  function syncStatus(text,error=false){const badge=$('portalSyncStatus');badge.hidden=!session?.user;badge.textContent=text;badge.classList.toggle('error',error);}
  function renderDM(){
    const c=shared.campaign;$('sharedCampaignInfo').textContent=c?`${c.map.name||'Campaña'} · ${c.resources.actors.length} personajes · versión ${shared.revision}`:'Comparte o importa una campaña antes de crear las cuentas.';
    const select=$('accountActor'),old=select.value;select.replaceChildren();const first=node('option','Selecciona un personaje');first.value='';select.append(first);
    for(const a of c?.resources.actors||[]){if(users.some(u=>u.actorId===a.id))continue;const option=node('option',a.name);option.value=a.id;select.append(option);}select.value=old;
    $('accountList').replaceChildren();
    for(const u of users){const row=node('div',undefined,'portal-account');const main=node('div');main.append(node('strong',u.username),node('small',u.role==='dm'?'Director de juego':`${c?.resources.actors.find(a=>a.id===u.actorId)?.name||'Personaje no disponible'}${u.disabled?' · Desactivada':''}`));row.append(main);
      if(u.role==='player'){const actions=node('div',undefined,'portal-account-actions');actions.append(button('Restablecer contraseña',()=>{resetUser=u;$('resetAccountName').textContent=u.email;$('resetPassword').value='';$('resetPasswordDialog').showModal();}),button(u.disabled?'Activar':'Desactivar',()=>run(async()=>{await api('/api/users/'+u.id,'PATCH',{disabled:!u.disabled});await refresh();message('Cuenta actualizada.');})),button('Eliminar acceso',()=>run(async()=>{if(!confirm('¿Eliminar el acceso de '+u.email+'? Su personaje, monedas e inventario se conservan. El correo y el personaje quedarán libres para registrarse otra vez.'))return;await api('/api/users/'+u.id,'DELETE',{email:u.email});await refresh();message('Acceso eliminado. El jugador puede crear de nuevo su cuenta y elegir su personaje.');})));row.append(actions);} $('accountList').append(row);}
  }
  function renderPlayer(shopsChanged=true){
    const a=shared.actor;$('playerName').textContent=a?.name||'Personaje pendiente';$('playerSubtitle').textContent=a?'Tus compras, equipo y provisiones, sincronizados con la mesa.':'El DM debe asignarte un personaje de la campaña compartida.';
    const entries=shared.entries||[],all=totals(entries),water=entries.filter(i=>i.type==='water').reduce((n,i)=>n+i.quantity,0),rations=entries.filter(i=>i.type==='resource'&&i.name.trim().toLowerCase()==='raciones').reduce((n,i)=>n+i.quantity,0);
    $('playerStats').replaceChildren();for(const [label,value]of [['Bolsa de oro',formatGold(copper(entries))],['Agua',String(water)],['Raciones',String(rations)],['Agotamiento',String(a?.exhaustion||0)]]){const card=node('div',undefined,'portal-stat');card.append(node('span',label),node('strong',value));$('playerStats').append(card);}
    inventoryList($('playerBackpack'),all.filter(i=>i.type==='backpack'));inventoryList($('playerResources'),all.filter(i=>i.type==='resource'||i.type==='water'));
    renderEquipment(a);
    if(shopsChanged){const select=$('playerShop');select.replaceChildren();for(const m of shared.merchants||[]){const option=node('option',m.name);option.value=m.id;select.append(option);}if(!shared.merchants.some(m=>m.id===selectedShop))selectedShop=shared.merchants[0]?.id||'';select.value=selectedShop;renderShop();}
  }
  function renderEquipment(actor){
    const root=$('playerEquipment');root.replaceChildren();root.append(node('h2','Equipo','equipment-title'));
    const figure=node('div',undefined,'equipment-figure portal-portrait');
    if(actor?.portrait){figure.classList.add('has-portrait');const portrait=node('img');portrait.className='equipment-portrait';portrait.src=actor.portrait;portrait.alt='Retrato de '+actor.name;figure.append(portrait);}
    else{figure.append(node('div',actor?.name?.trim().charAt(0)||'✦','portal-portrait-sigil'),node('small','Tu personaje'));figure.setAttribute('aria-label','Personaje sin retrato');}
    root.append(figure);
    const slots=[['head','Cabeza','Casco, sombrero, diadema'],['neck','Cuello','Amuleto, collar, símbolo sagrado'],['cloak','Capa','Capa o manto'],['armor','Armadura','Pechera, cuero, cota, placas'],['bracers','Brazos','Brazales o brazaletes'],['hands','Manos','Guantes o guanteletes'],['feet','Pies','Botas o calzado'],['focus','Foco / herramienta','Foco arcano, instrumento, herramienta'],['ring1','Anillo 1','Anillo equipado'],['mainHand','Mano principal','Arma, vara, bastón'],['ring2','Anillo 2','Segundo anillo equipado'],['offHand','Mano secundaria','Escudo, arma ligera, foco']];
    for(const [slot,label,hint] of slots){const card=node('div',undefined,'equipment-slot slot-'+slot),title=node('span',label);title.id='player-slot-'+slot;const value=node('output',actor?.equipment?.[slot]||'Vacío','portal-equipment-value');value.setAttribute('aria-labelledby',title.id);value.classList.toggle('empty',!actor?.equipment?.[slot]);card.append(title,node('small',hint),value);root.append(card);}
  }
  function inventoryList(root,items){
    const keys=new Set(items.map(i=>i.type+':'+i.name.trim().toLowerCase()));
    for(const row of [...root.children])if(!keys.has(row.dataset.key))row.remove();
    if(!items.length){root.append(node('p','Todavía no hay objetos aquí.'));return;}
    for(const [index,item] of items.entries()){
      const key=item.type+':'+item.name.trim().toLowerCase();let row=[...root.children].find(r=>r.dataset.key===key);
      if(!row){row=node('div',undefined,'portal-item');row.dataset.key=key;const quantity=node('input');quantity.type='number';quantity.min='1';quantity.step='1';quantity.value='1';row.append(node('strong'),quantity,button('Usar',()=>{}));root.insertBefore(row,root.children[index]||null);}
      row.querySelector('strong').textContent=`${item.name} × ${item.quantity}`;
      const quantity=row.querySelector('input');quantity.max=String(item.quantity);quantity.setAttribute('aria-label','Cantidad a usar de '+item.name);
      row.querySelector('button').onclick=()=>{const n=Number(quantity.value);if(!Number.isSafeInteger(n)||n<1||n>item.quantity){message('Indica una cantidad disponible.',true);return;}operate('/api/consume',{type:item.type,name:item.name,quantity:n,requestId:crypto.randomUUID()});};
    }
  }
  function priceCopper(price){const m=price.trim().match(/^(\d+(?:\.\d{3})*(?:,\d{1,2})?)\s*(po|pp|pc)(?:\/persona)?$/i);if(!m)return null;return Math.round(Number(m[1].replaceAll('.','').replace(',','.'))*({po:100,pp:10,pc:1}[m[2].toLowerCase()]));}
  function renderShop(){
    const drafts=new Map([...$('playerShopItems').querySelectorAll('input[data-product]')].map(input=>[input.dataset.product,input.value]));
    const focused=document.activeElement?.dataset.product;
    const merchant=shared?.merchants?.find(m=>m.id===selectedShop);$('playerShopItems').replaceChildren();$('playerShopDescription').replaceChildren();if(!merchant){$('playerShopDescription').append(node('p','El DM todavía no ha mostrado ningún comerciante.'));return;}
    const title=node('div',undefined,'portal-heading');title.append(node('h2',merchant.name));$('playerShopDescription').append(title,node('p',[merchant.location,merchant.description].filter(Boolean).join(' · ')));
    const items=merchant.items.filter(i=>(i.name+' '+i.use).toLocaleLowerCase('es').includes(search.toLocaleLowerCase('es')));
    for(const item of items){const card=node('article',undefined,'portal-product');card.append(node('h3',item.name),node('strong',item.price,'price'),node('p',item.use||'Artículo de la tienda.'));
      const unit=priceCopper(item.price);if(unit===null){card.append(node('p',/no se vende/i.test(item.price)?'No se vende.':'Consulta al DM para fijar el precio.'));}
      else{const label=node('label','Cantidad'),quantity=node('input');quantity.type='number';quantity.min='1';quantity.max='999';quantity.step='1';quantity.dataset.product=merchant.id+':'+item.id;quantity.value=drafts.get(quantity.dataset.product)||'1';quantity.setAttribute('aria-label','Cantidad de '+item.name);label.append(quantity);const buy=button('Comprar',()=>{const n=Number(quantity.value);if(!Number.isSafeInteger(n)||n<1||n>999){message('Indica una cantidad válida.',true);return;}operate('/api/buy',{merchantId:merchant.id,itemId:item.id,quantity:n,requestId:crypto.randomUUID()});});const cost=node('small',formatGold(unit));cost.style.fontSize='13px';quantity.oninput=()=>{const n=Number(quantity.value);cost.textContent=Number.isSafeInteger(n)&&n>0?formatGold(unit*n):'';};quantity.oninput();card.append(label,cost,buy);} $('playerShopItems').append(card);}
    if(focused)for(const input of $('playerShopItems').querySelectorAll('input[data-product]'))if(input.dataset.product===focused)input.focus({preventScroll:true});
    if(!items.length)$('playerShopItems').append(node('p','No hay artículos con esa búsqueda.'));
  }
  async function operate(path,data){if(busy||retry)return;await perform(path,data);}
  async function perform(path,data){await run(async()=>{try{message('Registrando la operación…');await api(path,'POST',data);retry=null;$('retryOperation').hidden=true;await refresh();message(path==='/api/buy'?'Compra realizada: oro descontado y artículo añadido a tu mochila.':'Cantidad usada y recursos actualizados.');}catch(e){if(e.network||e.status>=500){retry={path,data};$('retryOperation').hidden=false;}throw e;}});}
  $('retryOperation').onclick=()=>{if(retry)perform(retry.path,retry.data);};
  $('refreshPortal').onclick=()=>run(async()=>{await refresh();message('Datos actualizados.');});
  $('changePasswordBtn').onclick=()=>{if(session?.user&&!$('passwordSection').open){$('passwordMessage').textContent='';$('passwordSection').showModal();}};
  $('closePasswordBtn').onclick=()=>$('passwordSection').close();
  $('showLogin').onclick=()=>{if(!busy)setAccessMode(false);};
  $('showRegister').onclick=()=>run(async()=>{setAccessMode(true);await loadAvailableCharacters();});
  $('refreshCharacters').onclick=()=>run(loadAvailableCharacters);
  $('registerForm').onsubmit=e=>{e.preventDefault();run(async()=>{
    if(!$('registerActor').value)throw Error('Selecciona tu personaje para crear la cuenta.');
    if($('registerPassword').value!==$('registerConfirmPassword').value)throw Error('Las contraseñas no coinciden.');
    try{await api('/api/register','POST',{email:$('registerEmail').value,password:$('registerPassword').value,actorId:$('registerActor').value});}
    catch(error){if(error.status===409)await loadAvailableCharacters();throw error;}
    $('registerForm').reset();await loadSession();message('Cuenta creada. Ya puedes gestionar tu personaje.');
  });};
  $('loginForm').onsubmit=e=>{e.preventDefault();run(async()=>{await api('/api/login','POST',{email:$('loginEmail').value,password:$('loginPassword').value});$('loginPassword').value='';await loadSession();message(session.user.role==='player'?'':'Bienvenido a la mesa.');});};
  $('logoutBtn').onclick=()=>run(async()=>{const nativeOwner=session.ownerRecovery;await api('/api/logout','POST',{});session=null;shared=null;users=[];retry=null;$('retryOperation').hidden=true;$('playerBackpack').replaceChildren();$('playerResources').replaceChildren();$('playerShopItems').replaceChildren();$('accountList').replaceChildren();setAccessMode(false);showSections();message('Sesión cerrada.');if(nativeOwner)location.href='/signout-with-chatgpt?return_to=%2Fmesa.html';});
  $('passwordForm').onsubmit=e=>{e.preventDefault();run(async()=>{if($('changedPassword').value!==$('confirmPassword').value)throw Error('Las contraseñas no coinciden.');await api('/api/password','POST',{currentPassword:$('currentPassword').value,password:$('changedPassword').value,recover:!!session.ownerRecovery&&session.user.role==='dm'});$('passwordForm').reset();await loadSession();$('passwordSection').close();message('Contraseña guardada. Ya puedes entrar con tu correo desde otros dispositivos.');});};
  $('cancelResetPassword').onclick=()=>$('resetPasswordDialog').close();
  $('resetPasswordForm').onsubmit=e=>{e.preventDefault();run(async()=>{await api('/api/users/'+resetUser.id,'PATCH',{password:$('resetPassword').value});$('resetPasswordForm').reset();$('resetPasswordDialog').close();message('Contraseña restablecida y sesiones anteriores cerradas.');});};
  $('createPlayerForm').onsubmit=e=>{e.preventDefault();run(async()=>{await api('/api/users','POST',{email:$('newUsername').value,password:$('newPassword').value,actorId:$('accountActor').value});$('newUsername').value='';$('newPassword').value='';await refresh();message('Cuenta creada. El jugador ya puede entrar con su correo y contraseña de Rytta.');});};
  $('sharedCampaignFile').onchange=()=>run(async()=>{const file=$('sharedCampaignFile').files[0];if(!file)return;const c=JSON.parse(await file.text());if(!confirm('¿Compartir esta campaña en el servidor? Sustituirá la versión compartida actual.'))return;await api('/api/campaign','PUT',{revision:shared.revision,campaign:c});await refresh();message('Campaña compartida. Ya puedes asignar las cuentas.');$('sharedCampaignFile').value='';});
  $('downloadShared').onclick=()=>run(async()=>{await refresh();if(!shared.campaign)throw Error('Todavía no hay campaña compartida.');const exported=await api('/api/export');const url=URL.createObjectURL(new Blob([JSON.stringify(exported,null,2)],{type:'application/json'}));const a=node('a');a.href=url;a.download='rytta-compartida.json';a.click();URL.revokeObjectURL(url);});
  document.querySelectorAll('button[data-player-tab]').forEach(b=>b.onclick=()=>{document.body.dataset.playerTab=b.dataset.playerTab;document.querySelectorAll('button[data-player-tab]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b));});$('inventoryTab').hidden=b.dataset.playerTab!=='inventory';$('equipmentTab').hidden=b.dataset.playerTab!=='equipment';$('shopsTab').hidden=b.dataset.playerTab!=='shops';if(window.matchMedia('(max-width:700px)').matches)window.scrollTo({top:0,behavior:'instant'});});
  $('playerShop').onchange=()=>{selectedShop=$('playerShop').value;renderShop();};$('playerShopSearch').oninput=()=>{search=$('playerShopSearch').value;renderShop();};
  async function poll(){if(session?.user?.role!=='player'||busy||polling||document.hidden)return;polling=true;try{await refresh();}catch(error){syncStatus('Pendiente de conexión',true);if(error.status===401)handle(error);}finally{polling=false;}}
  setInterval(poll,2000);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)poll();});window.addEventListener('focus',poll);window.addEventListener('online',poll);
  run(loadSession).then(()=>{if(!session){$('loginSection').hidden=false;message('Abre esta página desde el servidor de Rytta para utilizar las cuentas online.',true);}});
})();
