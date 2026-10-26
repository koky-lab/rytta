function updateBackpackItem(actorId, originalName, nextName, quantity) {
  const name = String(nextName).trim();
  if (!state.resources.actors.some(a => a.id === actorId) || !name || !Number.isSafeInteger(quantity) || quantity < 0) return false;
  const key = originalName?.trim().toLowerCase();
  const entries = key ? state.resources.entries.filter(e => e.actorId === actorId && e.type === 'backpack' && e.name.trim().toLowerCase() === key) : [];
  if (key && !entries.length) return false;
  const current = entries.reduce((sum, e) => sum + (Number(e.quantity) || 0), 0);
  rememberUndo();
  // Keep purchase metadata and its coin payment; only change the backpack contents.
  for (const entry of entries) entry.name = name;
  const delta = quantity - current;
  if (delta) state.resources.entries.push({
    id: crypto.randomUUID(), actorId, type: 'backpack', name, quantity: delta,
    note: originalName ? 'Ajuste manual de mochila' : 'Añadido manualmente a la mochila', createdAt: new Date().toISOString(),
  });
  renderResources(); saveState(); return true;
}
function openBackpackEditor(actorId, item) {
  if (!state.resources.actors.some(a => a.id === actorId)) return;
  const dialog = merchantNode('dialog', undefined, 'merchant-dialog');
  const form = merchantNode('form'); form.append(merchantNode('h2', item ? 'Editar objeto de mochila' : 'Añadir a la mochila'));
  const nameLabel = merchantNode('label', undefined, 'input-row'); nameLabel.append(merchantNode('span', 'Objeto'));
  const name = merchantNode('input'); name.required = true; name.maxLength = 3000; name.value = item?.name || ''; nameLabel.append(name);
  const quantityLabel = merchantNode('label', undefined, 'input-row'); quantityLabel.append(merchantNode('span', item ? 'Cantidad total' : 'Cantidad a añadir'));
  const quantity = merchantNode('input'); quantity.type = 'number'; quantity.min = item ? '0' : '1'; quantity.step = '1'; quantity.required = true; quantity.value = String(item?.quantity ?? 1); quantityLabel.append(quantity);
  const actions = merchantNode('div', undefined, 'merchant-actions'); actions.append(merchantButton('Cancelar', () => dialog.close()));
  const save = merchantNode('button', 'Guardar'); save.type = 'submit'; actions.append(save);
  form.append(nameLabel, quantityLabel, actions);
  form.onsubmit = event => {
    event.preventDefault(); const count = Number(quantity.value);
    if (!item && count < 1) return;
    if (updateBackpackItem(actorId, item?.name, name.value, count)) dialog.close();
  };
  dialog.append(form); document.body.append(dialog); dialog.addEventListener('close', () => dialog.remove()); dialog.showModal(); name.focus();
}
function createBackpackRow(actorId, item) {
  const row = merchantNode('div', undefined, 'backpack-item-row'); row.setAttribute('role', 'listitem');
  row.append(merchantNode('span', `${item.name}: ${item.quantity}`));
  const actions = merchantNode('div', undefined, 'backpack-item-actions');
  const edit = merchantButton('Editar', () => openBackpackEditor(actorId, item)); edit.setAttribute('aria-label', `Editar ${item.name}`);
  const remove = merchantButton('Borrar', () => {
    if (confirm(`¿Quitar ${item.name} (${item.quantity}) de la mochila?`)) updateBackpackItem(actorId, item.name, item.name, 0);
  }); remove.setAttribute('aria-label', `Borrar ${item.name}`);
  actions.append(edit, remove); row.append(actions); return row;
}
