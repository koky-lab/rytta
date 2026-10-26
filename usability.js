/* Presentation state only: no campaign fields, storage keys or migrations. */
(() => {
  const shell = document.querySelector('#appShell');
  const atlas = document.querySelector('#atlasSidebar');
  const atlasToggle = document.querySelector('#atlasMobileToggleBtn');
  const atlasClose = document.querySelector('#atlasCloseBtn');
  const sessionToggle = document.querySelector('#sessionModeBtn');
  const composer = document.querySelector('#combatComposer');
  const composerToggle = document.querySelector('#combatComposerToggleBtn');
  const compact = window.matchMedia('(max-width: 900px)');
  let atlasOpen = false;
  let session = false;

  function syncAtlas() {
    const expanded = compact.matches && atlasOpen;
    shell.classList.toggle('atlas-mobile-open', expanded);
    atlasToggle.setAttribute('aria-expanded', String(expanded));
    atlasToggle.textContent = expanded ? 'Cerrar atlas' : 'Abrir atlas';
    atlas.inert = compact.matches && !expanded;
    if (compact.matches) atlas.setAttribute('aria-hidden', String(!expanded));
    else atlas.removeAttribute('aria-hidden');
  }
  function closeAtlas(returnFocus = false) {
    atlasOpen = false; syncAtlas();
    if (returnFocus && compact.matches) atlasToggle.focus();
  }
  atlasToggle.addEventListener('click', () => { atlasOpen = !atlasOpen; syncAtlas(); if (atlasOpen) atlasClose.focus(); });
  atlasClose.addEventListener('click', () => closeAtlas(true));
  compact.addEventListener('change', () => { atlasOpen = false; syncAtlas(); });
  document.querySelectorAll('.module-button').forEach(button => button.addEventListener('click', () => closeAtlas()));
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || !atlasOpen || document.querySelector('dialog[open]') || !document.querySelector('#resourceDialog').hidden) return;
    closeAtlas(true);
  });
  function syncComposer() {
    composerToggle.setAttribute('aria-expanded', String(composer.open && !session));
    composerToggle.textContent = composer.open && !session ? 'Ocultar formulario' : 'Añadir combatiente';
  }
  function setSession(value) {
    session = value;
    shell.classList.toggle('session-mode', session);
    sessionToggle.setAttribute('aria-pressed', String(session));
    sessionToggle.textContent = session ? 'Volver a edición' : 'Modo sesión';
    sessionToggle.title = session ? 'Mostrar todos los controles de edición' : 'Priorizar el contenido de la partida';
    syncComposer();
  }
  sessionToggle.addEventListener('click', () => setSession(!session));
  composerToggle.addEventListener('click', () => {
    if (session) { setSession(false); composer.open = true; }
    else composer.open = !composer.open;
    syncComposer();
    if (composer.open) {
      composer.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      document.querySelector('#initiativeNameInput').focus({ preventScroll: true });
    }
  });
  composer.addEventListener('toggle', syncComposer);
  document.querySelector('#initiativeNextBtn').addEventListener('click', () => {
    if (document.querySelector('#initiativeList .initiative-row')) { composer.open = false; syncComposer(); }
  });
  document.querySelector('#initiativeClearBtn').addEventListener('click', () => {
    if (!document.querySelector('#initiativeList .initiative-row')) { composer.open = true; syncComposer(); }
  });
  syncAtlas(); syncComposer();
})();
