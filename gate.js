// The published campaign is the only source of game data.
window.RYTTA_SHARED=true;
document.documentElement.classList.add('shared-starting');
if(location.protocol==='file:')location.replace('https://rytta-mesa-aventureros.ealvarezaragones.chatgpt.site/');
if(/^https?:$/.test(location.protocol)&&location.hostname.endsWith('.chatgpt.site')){document.documentElement.style.visibility='hidden';const ryttaGateController=new AbortController(),ryttaGateTimeout=setTimeout(()=>ryttaGateController.abort(),15000);fetch('/api/session',{credentials:'same-origin',cache:'no-store',signal:ryttaGateController.signal}).then(r=>r.json()).then(s=>{if(s.user?.role==='dm')document.documentElement.style.visibility='';else location.replace('/mesa.html');}).catch(()=>location.replace('/mesa.html')).finally(()=>clearTimeout(ryttaGateTimeout));}
