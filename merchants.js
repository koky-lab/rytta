function normalizeBackpackEntry(entry) {
  if (entry.type === "resource" && (entry.purchase || /^Compra en .+\. Precio: /.test(entry.note || ""))) return { ...entry, type: "backpack" };
  return entry;
}
let selectedMerchantId = '';
let merchantSearch = '';
let merchantPurchaseMessage = '';
function merchantPriceCopper(price) {
  const match = String(price).trim().match(/^(\d+(?:\.\d{3})*(?:,\d{1,2})?)\s*(po|pp|pc)(?:\/persona)?$/i);
  if (!match) return null;
  const amount = Number(match[1].replaceAll('.', '').replace(',', '.'));
  const copper = amount * ({ po: 100, pp: 10, pc: 1 }[match[2].toLowerCase()]);
  return Number.isSafeInteger(Math.round(copper)) && Math.abs(copper - Math.round(copper)) < 1e-7 ? Math.round(copper) : null;
}
function merchantGoldCopper(value) {
  if (!/^\d+(?:[.,]\d{1,2})?$/.test(String(value).trim())) return null;
  const copper = Number(String(value).replace(',', '.')) * 100;
  return Number.isSafeInteger(Math.round(copper)) ? Math.round(copper) : null;
}
function merchantBalanceCopper(actorId) {
  return state.resources.entries.filter(e => e.actorId === actorId && e.type === 'coin')
    .reduce((sum, e) => sum + Math.round((Number(e.quantity) || 0) * 100), 0);
}
function buyMerchantItem(merchantId, itemId, actorId, agreedGold) {
  const merchant = state.merchants.find(m => m.id === merchantId);
  const item = merchant?.items.find(i => i.id === itemId);
  const actor = state.resources.actors.find(a => a.id === actorId);
  if (!merchant || !item || !actor || (state.role !== 'dm' && !merchant.visible) || /no se vende/i.test(item.price)) return false;
  const fixedPrice = merchantPriceCopper(item.price);
  const cost = fixedPrice === null ? merchantGoldCopper(agreedGold) : fixedPrice;
  if (cost === null || merchantBalanceCopper(actor.id) < cost) {
    merchantPurchaseMessage = cost === null ? 'Indica un precio acordado válido en po.' : `${actor.name} no tiene oro suficiente para comprar ${item.name}.`;
    renderMerchants(); return false;
  }
  rememberUndo();
  const transactionId = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  state.resources.entries.push({
    id: crypto.randomUUID(), actorId: actor.id, type: 'backpack', name: item.name, purchase: { merchantId: merchant.id, itemId: item.id, price: item.price, paidGold: cost / 100, transactionId }, quantity: 1,
    note: `Compra en ${merchant.name}. Pagado: ${cost / 100} po. ${item.use}`, createdAt,
  }, {
    id: crypto.randomUUID(), actorId: actor.id, type: 'coin', name: 'Oro', quantity: -cost / 100,
    note: `Compra de ${item.name} en ${merchant.name}`, transactionId, createdAt,
  });
  merchantPurchaseMessage = `${actor.name} recibe: ${item.name}. Descontado: ${cost / 100} po. Saldo: ${merchantBalanceCopper(actor.id) / 100} po.`;
  renderResources(); saveState(); renderMerchants(); return true;
}
function merchantPurchaseCell(merchant, item) {
  const cell = merchantNode('td', undefined, 'merchant-purchase');
  if (/no se vende/i.test(item.price)) { cell.append(merchantNode('span', 'No se vende')); return cell; }
  const select = merchantNode('select');
  select.setAttribute('aria-label', `Quién compra ${item.name}`);
  const placeholder = merchantNode('option', state.resources.actors.length ? 'Seleccionar jugador…' : 'Añade jugadores en Recursos');
  placeholder.value = ''; select.append(placeholder);
  for (const actor of state.resources.actors) { const option = merchantNode('option', `${actor.name} (${merchantBalanceCopper(actor.id) / 100} po)`); option.value = actor.id; select.append(option); }
  select.value = '';
  const agreed = merchantNode('input'); agreed.type = 'text'; agreed.inputMode = 'decimal';
  agreed.placeholder = 'Precio acordado (po)'; agreed.setAttribute('aria-label', `Precio acordado en po para ${item.name}`);
  const fixed = merchantPriceCopper(item.price);
  const buy = merchantButton('Comprar', () => buyMerchantItem(merchant.id, item.id, select.value, agreed.value));
  buy.disabled = true; select.disabled = !state.resources.actors.length;
  select.onchange = () => { buy.disabled = !select.value; };
  cell.append(select, buy); if (fixed === null) cell.append(agreed); return cell;
}
function normalizeMerchants(value) {
  if (!Array.isArray(value)) return structuredClone(DEFAULT_MERCHANTS);
  return value.filter(m => m && typeof m === 'object').map(m => ({
    id: String(m.id || crypto.randomUUID()), name: String(m.name || 'Comerciante'),
    location: String(m.location || ''), description: String(m.description || ''), visible: m.visible === true,
    items: (Array.isArray(m.items) ? m.items : []).filter(i => i && typeof i === 'object').map(i => ({
      id: String(i.id || crypto.randomUUID()), name: String(i.name || ''), price: String(i.price || ''), use: String(i.use || '')
    }))
  }));
}
function merchantNode(tag, text, className) {
  const el = document.createElement(tag); if (text !== undefined) el.textContent = text;
  if (className) el.className = className; return el;
}
function merchantButton(text, action) {
  const b = merchantNode('button', text, 'secondary'); b.type = 'button'; b.onclick = action; return b;
}
function merchantChange(action) {
  if (state.role !== 'dm') return;
  rememberUndo(); action(); saveState(); renderMerchants();
}
function merchantForm(title, fields, submit) {
  const dialog = merchantNode('dialog', undefined, 'merchant-dialog');
  const form = merchantNode('form'); form.append(merchantNode('h2', title));
  const inputs = {};
  for (const [key,label,value,required] of fields) {
    const wrap = merchantNode('label', undefined, 'input-row'); wrap.append(merchantNode('span',label));
    const input = merchantNode(key === 'description' || key === 'use' ? 'textarea' : 'input');
    input.value = value || ''; input.required = !!required; input.maxLength = 3000; inputs[key] = input; wrap.append(input); form.append(wrap);
  }
  const actions = merchantNode('div', undefined, 'merchant-actions');
  actions.append(merchantButton('Cancelar',()=>dialog.close()));
  const save = merchantNode('button','Guardar'); save.type='submit'; actions.append(save);form.append(actions);
  form.onsubmit = e => { e.preventDefault(); if(state.role !== 'dm'){dialog.close();return;}
    const values = Object.fromEntries(Object.entries(inputs).map(([k,v])=>[k,v.value.trim()]));
    if(fields.some(([k,,,required])=>required && !values[k]))return;
    merchantChange(()=>submit(values)); dialog.close();
  };
  dialog.append(form); document.body.append(dialog);dialog.addEventListener('close',()=>dialog.remove());dialog.showModal();
}
function editMerchant(merchant) {
  merchantForm(merchant ? 'Editar comerciante' : 'Nuevo comerciante',[
    ['name','Nombre',merchant?.name,true],['location','Ubicación (ciudad, puerto o local)',merchant?.location],['description','Descripción pública',merchant?.description]
  ], values=> {if(merchant)Object.assign(merchant,values);else {const m={...values,id:crypto.randomUUID(),visible:false,items:[]};state.merchants.push(m);selectedMerchantId=m.id;}});
}
function editMerchantItem(merchant,item) {
  merchantForm(item?'Editar artículo':'Añadir artículo',[
    ['name','Objeto o servicio',item?.name,true],['price','Precio (po, pp, pc, rango o favor)',item?.price,true],['use','Uso',item?.use]
  ],values=>{if(item)Object.assign(item,values);else merchant.items.push({...values,id:crypto.randomUUID()});});
}
function renderMerchants() {
  const root=document.querySelector('#merchantsModule');if(!root)return;
  root.replaceChildren();const dm=state.role==='dm';
  const header=merchantNode('div',undefined,'module-header');header.append(merchantNode('h2','Comerciantes'));
  if(dm) header.append(merchantButton('＋ Nuevo comerciante',()=>editMerchant())); root.append(header);
  root.append(merchantNode('p',dm?'Gestiona los catálogos y activa «Visible para jugadores» para mostrarlos.':'Consulta los comerciantes disponibles y sus artículos.','hint'));
  root.append(merchantNode('p', 'Cada compra añade una unidad a la mochila y descuenta el precio de la bolsa de oro. Los precios en pp y pc se convierten a po. Para rangos o favores, indica el precio acordado en po (0 si no cuesta oro).', 'hint'));
  if (merchantPurchaseMessage) { const status = merchantNode('p', merchantPurchaseMessage, 'merchant-purchase-status'); status.setAttribute('role', 'status'); root.append(status); }
  const available=state.merchants.filter(m=>dm||m.visible);
  if(!available.some(m=>m.id===selectedMerchantId))selectedMerchantId=available[0]?.id||'';
  const layout=merchantNode('div',undefined,'merchant-layout');const list=merchantNode('nav',undefined,'merchant-list');list.setAttribute('aria-label','Lista de comerciantes');
  for(const m of available){const b=merchantButton(`${m.name}${m.location?' · '+m.location:''}${dm&&!m.visible?' (oculto)':''}`,()=>{selectedMerchantId=m.id;merchantSearch='';renderMerchants();});b.classList.toggle('active',m.id===selectedMerchantId);b.setAttribute('aria-pressed',String(m.id===selectedMerchantId));list.append(b);}
  layout.append(list);const content=merchantNode('div',undefined,'merchant-content');layout.append(content);root.append(layout);
  const merchant=available.find(m=>m.id===selectedMerchantId);
  if(!merchant){content.append(merchantNode('p',dm?'Crea un comerciante para comenzar.':'El DM todavía no ha mostrado ningún comerciante.'));return;}
  content.append(merchantNode('h2',merchant.name));if(merchant.location)content.append(merchantNode('p','📍 '+merchant.location));if(merchant.description)content.append(merchantNode('p',merchant.description));
  if(dm){const actions=merchantNode('div',undefined,'merchant-actions');
    const label=merchantNode('label');const visible=merchantNode('input');visible.type='checkbox';visible.checked=merchant.visible;visible.onchange=()=>merchantChange(()=>merchant.visible=visible.checked);label.append(visible,document.createTextNode(' Visible para jugadores'));
    actions.append(label,merchantButton('Editar comerciante',()=>editMerchant(merchant)),merchantButton('Añadir artículo',()=>editMerchantItem(merchant)),merchantButton('Eliminar comerciante',()=>{if(confirm('¿Eliminar este comerciante y su catálogo?'))merchantChange(()=>state.merchants=state.merchants.filter(m=>m!==merchant));}));content.append(actions);
  }
  const search=merchantNode('input');search.type='search';search.placeholder='Buscar artículo o uso…';search.setAttribute('aria-label','Buscar artículo o uso');search.value=merchantSearch;content.append(search);
  const results=merchantNode('div',undefined,'merchant-table-wrap');content.append(results);
  function draw(){results.replaceChildren();const q=merchantSearch.toLocaleLowerCase('es');const items=merchant.items.filter(i=>(i.name+' '+i.use).toLocaleLowerCase('es').includes(q));
    const table=merchantNode('table',undefined,'merchant-table');table.setAttribute('aria-label', 'Catálogo de ' + merchant.name);const head=merchantNode('thead');const hr=merchantNode('tr');for(const label of ['Objeto / servicio','Precio','Uso','Compra',...(dm?['Acciones']:[])])hr.append(merchantNode('th',label));head.append(hr);table.append(head);const body=merchantNode('tbody');
    for(const item of items){const row=merchantNode('tr');for(const value of [item.name,item.price,item.use||'—']){const cell=merchantNode('td',value);cell.dataset.label=['Objeto / servicio','Precio','Uso'][row.children.length];row.append(cell);}
      const purchaseCell=merchantPurchaseCell(merchant, item);purchaseCell.dataset.label='Compra';row.append(purchaseCell);
      if(dm){const td=merchantNode('td');td.dataset.label='Gestión';td.className='merchant-management';td.append(merchantButton('Editar',()=>editMerchantItem(merchant,item)),merchantButton('Quitar',()=>{if(confirm('¿Quitar «'+item.name+'»?'))merchantChange(()=>merchant.items=merchant.items.filter(i=>i!==item));}));row.append(td);}body.append(row);}
    table.append(body);results.append(merchantNode('p',`${items.length} artículos / servicios`,'hint'),table);if(!items.length)results.append(merchantNode('p','No hay artículos que mostrar.'));
  }
  search.oninput=()=>{merchantSearch=search.value;draw();};draw();
}
