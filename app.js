const STORAGE_KEY = "dnd-atlas-campaign-v1";
const SETUPS_KEY = "dnd-atlas-setups-v1";
const DB_NAME = "dnd-atlas-db";
const DB_VERSION = 1;
const CAMPAIGN_KEY = "campaign";
const SETUPS_DB_KEY = "setups";
const UNDO_LIMIT = 30;
const DEFAULT_MARKER_ICON = "assets/pin.png";

const terrainRules = {
  road: { label: "Camino", multiplier: 0.8, color: "#d8aa47", note: "sendero claro" },
  plain: { label: "Llanura", multiplier: 1, color: "#89c46f", note: "terreno simple" },
  forest: { label: "Bosque", multiplier: 2, color: "#2f8f5b", note: "terreno dificil" },
  mountain: { label: "Montana", multiplier: 3, color: "#a8a29a", note: "subida o trepada" },
  swamp: { label: "Pantano", multiplier: 2, color: "#7f8f3a", note: "terreno dificil" },
  sea: { label: "Mar", multiplier: 1, color: "#4f9fd8", note: "usa velocidad de barco o nado" },
};

const speedPresets = {
  walkSlow: { label: "A pie lento/sigilo", speed: 29 },
  walkNormal: { label: "A pie normal", speed: 38 },
  walkFast: { label: "A pie rapido", speed: 48 },
  horse: { label: "A caballo", speed: 64 },
  forcedRun: { label: "Corriendo / marcha forzada", speed: 60 },
  swim: { label: "Nadando", speed: 19 },
  boat: { label: "Barca o costa", speed: 38 },
  custom: { label: "Personalizada", speed: 38 },
};

const layerRules = {
  cities: { label: "Ciudades", icon: "\u{1F3F0}" },
  dungeons: { label: "Mazmorras", icon: "\u{1F5DD}\uFE0F" },
  danger: { label: "Peligros", icon: "\u2694\uFE0F" },
  factions: { label: "Facciones", icon: "\u{1F6E1}\uFE0F" },
  resources: { label: "Recursos", icon: "\u{1F4B0}" },
  notes: { label: "Notas", icon: "\u{1F4DC}" },
};

const state = {
  role: "dm",
  activeModule: "map",
  selectedPointId: null,
  currentMapId: "main",
  mapHistory: [],
  map: {
    id: "main",
    name: "Mapa principal",
    image: "",
    width: 1600,
    height: 1000,
  },
  points: [],
  route: [],
  routeMode: false,
  toolMode: "explore",
  panMode: false,
  spacePan: false,
  activeTerrain: "road",
  speedPreset: "walkNormal",
  visibleLayers: {
    cities: true,
    dungeons: true,
    danger: true,
    factions: true,
    resources: true,
    notes: true,
  },
  savedRoutes: {},
  activeSavedRoute: "",
  showSavedRoutes: true,
  measureRoute: [],
  setups: {},
  undoStack: [],
  sidebarCollapsed: false,
  initiative: {
    combatants: [],
    savedPlayers: [],
    activeIndex: 0,
    round: 1,
  },
  view: {
    scale: 1,
    x: 0,
    y: 0,
  },
};

const els = {
  dmModeBtn: document.querySelector("#dmModeBtn"),
  playerModeBtn: document.querySelector("#playerModeBtn"),
  roleBadge: document.querySelector("#roleBadge"),
  appShell: document.querySelector("#appShell"),
  sidebarToggleBtn: document.querySelector("#sidebarToggleBtn"),
  mapModuleBtn: document.querySelector("#mapModuleBtn"),
  initiativeModuleBtn: document.querySelector("#initiativeModuleBtn"),
  futureToolModuleBtn: document.querySelector("#futureToolModuleBtn"),
  mapControls: document.querySelector("#mapControls"),
  mapUpload: document.querySelector("#mapUpload"),
  mapNameInput: document.querySelector("#mapNameInput"),
  mapUploadLabel: document.querySelector("#mapUploadLabel"),
  saveMapNameBtn: document.querySelector("#saveMapNameBtn"),
  goMainMapBtn: document.querySelector("#goMainMapBtn"),
  resetViewBtn: document.querySelector("#resetViewBtn"),
  mapTitle: document.querySelector("#mapTitle"),
  mapContextBadge: document.querySelector("#mapContextBadge"),
  viewport: document.querySelector("#mapViewport"),
  canvas: document.querySelector("#mapCanvas"),
  mapImage: document.querySelector("#mapImage"),
  emptyState: document.querySelector("#emptyState"),
  emptyStateTitle: document.querySelector("#emptyStateTitle"),
  emptyStateText: document.querySelector("#emptyStateText"),
  pointLayer: document.querySelector("#pointLayer"),
  routeLayer: document.querySelector("#routeLayer"),
  detailsPanel: document.querySelector("#detailsPanel"),
  detailsTemplate: document.querySelector("#detailsTemplate"),
  locationSearch: document.querySelector("#locationSearch"),
  locationList: document.querySelector("#locationList"),
  layerControls: document.querySelector("#layerControls"),
  exportBtn: document.querySelector("#exportBtn"),
  importInput: document.querySelector("#importInput"),
  setupNameInput: document.querySelector("#setupNameInput"),
  setupSelect: document.querySelector("#setupSelect"),
  saveSetupBtn: document.querySelector("#saveSetupBtn"),
  loadSetupBtn: document.querySelector("#loadSetupBtn"),
  deleteSetupBtn: document.querySelector("#deleteSetupBtn"),
  routeModeBtn: document.querySelector("#routeModeBtn"),
  clearRouteBtn: document.querySelector("#clearRouteBtn"),
  measureModeBtn: document.querySelector("#measureModeBtn"),
  clearMeasureBtn: document.querySelector("#clearMeasureBtn"),
  routeNameInput: document.querySelector("#routeNameInput"),
  savedRouteSelect: document.querySelector("#savedRouteSelect"),
  saveRouteBtn: document.querySelector("#saveRouteBtn"),
  loadRouteBtn: document.querySelector("#loadRouteBtn"),
  toggleSavedRoutesBtn: document.querySelector("#toggleSavedRoutesBtn"),
  deleteRouteBtn: document.querySelector("#deleteRouteBtn"),
  scaleInput: document.querySelector("#scaleInput"),
  kmPerPixelInput: document.querySelector("#kmPerPixelInput"),
  speedPresetSelect: document.querySelector("#speedPresetSelect"),
  speedInput: document.querySelector("#speedInput"),
  routeSummary: document.querySelector("#routeSummary"),
  measureSummary: document.querySelector("#measureSummary"),
  toolStatus: document.querySelector("#toolStatus"),
  saveStatus: document.querySelector("#saveStatus"),
  backToMainBtn: document.querySelector("#backToMainBtn"),
  zoomInBtn: document.querySelector("#zoomInBtn"),
  zoomOutBtn: document.querySelector("#zoomOutBtn"),
  initiativeModule: document.querySelector("#initiativeModule"),
  futureToolModule: document.querySelector("#futureToolModule"),
  initiativeForm: document.querySelector("#initiativeForm"),
  initiativeSavedPlayerSelect: document.querySelector("#initiativeSavedPlayerSelect"),
  initiativeNameInput: document.querySelector("#initiativeNameInput"),
  initiativeNicknameRow: document.querySelector("#initiativeNicknameRow"),
  initiativeNicknameInput: document.querySelector("#initiativeNicknameInput"),
  initiativeValueInput: document.querySelector("#initiativeValueInput"),
  initiativeHpInput: document.querySelector("#initiativeHpInput"),
  initiativeAcInput: document.querySelector("#initiativeAcInput"),
  initiativeTypeInput: document.querySelector("#initiativeTypeInput"),
  initiativeSortBtn: document.querySelector("#initiativeSortBtn"),
  initiativeNextBtn: document.querySelector("#initiativeNextBtn"),
  initiativeResetBtn: document.querySelector("#initiativeResetBtn"),
  initiativeClearBtn: document.querySelector("#initiativeClearBtn"),
  initiativeRound: document.querySelector("#initiativeRound"),
  initiativeTurn: document.querySelector("#initiativeTurn"),
  initiativeList: document.querySelector("#initiativeList"),
};

let drag = null;
let ignoreClick = false;
let pointDrag = null;
let ignoreMarkerClick = false;
let markerPreview = null;
let markerClickTimer = null;
let dbPromise = null;
let saveChain = Promise.resolve();

function openDatabase() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("kv")) db.createObjectStore("kv");
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  return dbPromise;
}

async function dbGet(key) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("kv", "readonly");
    const request = transaction.objectStore("kv").get(key);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function dbSet(key, value) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("kv", "readwrite");
    const request = transaction.objectStore("kv").put(value, key);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

function getCampaignData() {
  return {
    savedAt: new Date().toISOString(),
    role: state.role,
    currentMapId: state.currentMapId,
    mapHistory: state.mapHistory,
    map: state.map,
    points: state.points,
    route: state.route,
    routeMode: state.routeMode,
    toolMode: state.toolMode,
    activeTerrain: state.activeTerrain,
    speedPreset: state.speedPreset,
    visibleLayers: state.visibleLayers,
    savedRoutes: state.savedRoutes,
    activeSavedRoute: state.activeSavedRoute,
    showSavedRoutes: state.showSavedRoutes,
    measureRoute: state.measureRoute,
    sidebarCollapsed: state.sidebarCollapsed,
    initiative: state.initiative,
    scale: Number(els.scaleInput.value),
    kmPerPixel: Number(els.kmPerPixelInput.value),
    speed: Number(els.speedInput.value),
  };
}

function applyCampaignData(saved) {
  if (!saved) return;
  state.role = saved.role || "dm";
  state.activeModule = "map";
  state.currentMapId = saved.currentMapId || "main";
  state.mapHistory = Array.isArray(saved.mapHistory) ? saved.mapHistory : [];
  state.map = saved.map || state.map;
  state.points = Array.isArray(saved.points) ? saved.points : [];
  state.route = Array.isArray(saved.route) ? saved.route : [];
  state.toolMode = saved.toolMode === "pan" ? "explore" : saved.toolMode || (state.routeMode ? "route" : "explore");
  state.routeMode = state.toolMode === "route";
  state.panMode = false;
  state.activeTerrain = saved.activeTerrain || "road";
  state.speedPreset = saved.speedPreset || "walkNormal";
  state.visibleLayers = { ...state.visibleLayers, ...(saved.visibleLayers || {}) };
  state.savedRoutes = saved.savedRoutes || {};
  state.activeSavedRoute = saved.activeSavedRoute || "";
  state.showSavedRoutes = saved.showSavedRoutes !== false;
  state.measureRoute = Array.isArray(saved.measureRoute) ? saved.measureRoute : [];
  state.sidebarCollapsed = saved.sidebarCollapsed === true;
  state.initiative = {
    combatants: Array.isArray(saved.initiative?.combatants) ? saved.initiative.combatants : [],
    savedPlayers: Array.isArray(saved.initiative?.savedPlayers) ? saved.initiative.savedPlayers : [],
    activeIndex: Number.isInteger(saved.initiative?.activeIndex) ? saved.initiative.activeIndex : 0,
    round: saved.initiative?.round || 1,
  };
  els.scaleInput.value = saved.scale || 1;
  els.kmPerPixelInput.value = saved.kmPerPixel || 0.05;
  els.speedInput.value = saved.speed || 38;
  els.speedPresetSelect.value = state.speedPreset;
  els.routeModeBtn.classList.toggle("active", state.toolMode === "route");
  els.measureModeBtn.classList.toggle("active", state.toolMode === "measure");
  document.querySelectorAll(".terrain").forEach((item) => {
    item.classList.toggle("active", item.dataset.terrain === state.activeTerrain);
  });
  updateToolButtons();
  applySidebarState();
  setActiveModule(state.activeModule, { skipSave: true });
}

function applySidebarState() {
  els.appShell.classList.toggle("sidebar-collapsed", state.sidebarCollapsed);
  els.sidebarToggleBtn.textContent = state.sidebarCollapsed ? "Mostrar panel" : "Ocultar panel";
  els.sidebarToggleBtn.title = state.sidebarCollapsed ? "Mostrar el panel lateral" : "Ocultar el panel lateral";
  els.sidebarToggleBtn.setAttribute("aria-expanded", String(!state.sidebarCollapsed));
  requestAnimationFrame(() => applyTransform());
}

function snapshotState() {
  return JSON.parse(JSON.stringify({
    ...getCampaignData(),
    selectedPointId: state.selectedPointId,
  }));
}

function rememberUndo() {
  state.undoStack.push(snapshotState());
  if (state.undoStack.length > UNDO_LIMIT) state.undoStack.shift();
}

function restoreSnapshot(snapshot) {
  state.selectedPointId = snapshot.selectedPointId || null;
  applyCampaignData(snapshot);
  setRole(state.role, { skipSave: true });
  applyMapImage({ skipSave: true });
  saveState();
}

function undoLastChange() {
  const snapshot = state.undoStack.pop();
  if (!snapshot) return;
  restoreSnapshot(snapshot);
}

async function saveState() {
  const data = getCampaignData();
  updateSaveStatus("Guardando...");
  saveChain = saveChain.then(async () => {
    try {
      await dbSet(CAMPAIGN_KEY, data);
      updateSaveStatus("Guardado");
    } catch (error) {
      console.warn("No se pudo guardar en la base de datos local", error);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        updateSaveStatus("Guardado de emergencia");
      } catch (fallbackError) {
        console.warn("Tampoco se pudo guardar la copia de emergencia", fallbackError);
        updateSaveStatus("Error al guardar");
      }
    }
  });
  return saveChain;
}

function updateSaveStatus(text) {
  if (!els.saveStatus) return;
  els.saveStatus.textContent = text;
}

async function loadSetups() {
  try {
    const stored = await dbGet(SETUPS_DB_KEY);
    if (stored) {
      state.setups = stored;
    } else {
      state.setups = JSON.parse(localStorage.getItem(SETUPS_KEY) || "{}");
      if (Object.keys(state.setups).length) await saveSetups();
    }
  } catch (error) {
    try {
      state.setups = JSON.parse(localStorage.getItem(SETUPS_KEY) || "{}");
    } catch (fallbackError) {
      state.setups = {};
    }
  }
  renderSetupOptions();
}

async function saveSetups() {
  try {
    await dbSet(SETUPS_DB_KEY, state.setups);
  } catch (error) {
    console.warn("No se pudieron guardar los setups en la base de datos local", error);
    localStorage.setItem(SETUPS_KEY, JSON.stringify(state.setups));
  }
  renderSetupOptions();
}

function renderSetupOptions() {
  const names = Object.keys(state.setups).sort((a, b) => a.localeCompare(b));
  els.setupSelect.innerHTML = "";

  if (!names.length) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "Sin setups guardados";
    els.setupSelect.appendChild(option);
    return;
  }

  names.forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    els.setupSelect.appendChild(option);
  });
}

function currentSetup() {
  return {
    scale: Number(els.scaleInput.value),
    kmPerPixel: Number(els.kmPerPixelInput.value),
    speed: Number(els.speedInput.value),
    speedPreset: state.speedPreset,
    activeTerrain: state.activeTerrain,
  };
}

function applySetup(setup) {
  if (!setup) return;
  rememberUndo();
  els.scaleInput.value = setup.scale || 1;
  els.kmPerPixelInput.value = setup.kmPerPixel || 0.05;
  els.speedInput.value = setup.speed || 38;
  state.speedPreset = setup.speedPreset || "custom";
  els.speedPresetSelect.value = state.speedPreset;
  state.activeTerrain = setup.activeTerrain || "road";
  document.querySelectorAll(".terrain").forEach((item) => {
    item.classList.toggle("active", item.dataset.terrain === state.activeTerrain);
  });
  updateRouteSummary();
  saveState();
}

async function loadState() {
  try {
    const saved = await dbGet(CAMPAIGN_KEY);
    if (saved) {
      applyCampaignData(saved);
      return;
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    applyCampaignData(JSON.parse(raw));
    await saveState();
  } catch (error) {
    console.warn("No se pudo cargar la campana guardada desde la base de datos", error);
  }
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function updatePanCursor() {
  els.viewport.classList.toggle("can-pan", state.spacePan);
}

function setActiveTab(tab) {
  setActiveModule("map", { skipSave: true });
  document.querySelectorAll(".tab-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === tab);
  });
  document.querySelectorAll(".tab-panel").forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.tabPanel === tab);
  });
}

function setActiveModule(module, options = {}) {
  const allowedModules = ["map", "initiative", "futureTool"];
  state.activeModule = allowedModules.includes(module) ? module : "map";
  const isMap = state.activeModule === "map";
  els.viewport.hidden = !isMap;
  els.mapControls.hidden = !isMap;
  els.initiativeModule.hidden = state.activeModule !== "initiative";
  els.futureToolModule.hidden = state.activeModule !== "futureTool";
  document.querySelectorAll(".module-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.module === state.activeModule);
  });
  if (isMap) requestAnimationFrame(() => applyTransform());
  if (!options.skipSave) saveState();
}

function setToolMode(mode) {
  setActiveModule("map", { skipSave: true });
  if (mode === "pan") mode = "explore";
  rememberUndo();
  state.toolMode = mode;
  state.routeMode = mode === "route";
  state.panMode = false;
  if (mode === "route" || mode === "measure") state.selectedPointId = null;
  if (mode === "route" || mode === "measure") setActiveTab("routes");
  updatePanCursor();
  updateToolButtons();
  renderAll();
  saveState();
}

function updateToolButtons() {
  document.querySelectorAll(".tool-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.tool === state.toolMode);
  });
  els.routeModeBtn.classList.toggle("active", state.toolMode === "route");
  els.measureModeBtn.classList.toggle("active", state.toolMode === "measure");
  const textByMode = {
    explore: "Explorar: clic en una marca para verla; doble clic entra en ciudades.",
    edit: "Anadir punto: clic en el mapa crea una localizacion. Shift + clic tambien funciona.",
    route: "Ruta: clic en mapa o marcador para anadir tramos. Las fichas no se abren.",
    measure: "Medir: clics temporales para medir distancia sin guardar ruta.",
  };
  els.toolStatus.textContent = textByMode[state.toolMode] || textByMode.explore;
}

function getActiveMap() {
  if (state.currentMapId === "main") return state.map;
  const ownerId = state.currentMapId.replace("submap-", "");
  const owner = state.points.find((point) => point.id === ownerId);
  if (!owner) {
    state.currentMapId = "main";
    return state.map;
  }
  return {
    id: state.currentMapId,
    name: owner.title,
    image: owner.submap || "",
    width: owner.submapWidth || 1600,
    height: owner.submapHeight || 1000,
  };
}

function updateActiveMapSize(width, height) {
  if (state.currentMapId === "main") {
    state.map.width = width;
    state.map.height = height;
    return;
  }

  const ownerId = state.currentMapId.replace("submap-", "");
  const owner = state.points.find((point) => point.id === ownerId);
  if (owner) {
    owner.submapWidth = width;
    owner.submapHeight = height;
  }
}

function getSubmapOwner() {
  if (state.currentMapId === "main") return null;
  const ownerId = state.currentMapId.replace("submap-", "");
  return state.points.find((point) => point.id === ownerId) || null;
}

function enterSubmap(point, options = {}) {
  if (!point) return;
  if (options.remember !== false) rememberUndo();
  markerPreview = null;
  if (options.pushHistory !== false && state.currentMapId !== `submap-${point.id}`) {
    state.mapHistory.push(state.currentMapId);
  }
  state.currentMapId = `submap-${point.id}`;
  state.selectedPointId = null;
  state.route = [];
  applyMapImage();
  saveState();
}

function goBackMap() {
  rememberUndo();
  markerPreview = null;
  state.currentMapId = state.mapHistory.pop() || "main";
  state.selectedPointId = null;
  state.route = [];
  applyMapImage();
  saveState();
}

function goMainMap() {
  rememberUndo();
  markerPreview = null;
  state.currentMapId = "main";
  state.mapHistory = [];
  state.selectedPointId = null;
  state.route = [];
  setActiveTab("map");
  applyMapImage();
  saveState();
}

function canEnterSubmap(point) {
  if (!point) return false;
  if (state.role === "dm") return true;
  return !point.hidden && Boolean(point.submap);
}

function setRole(role, options = {}) {
  if (!options.skipUndo && state.role !== role) rememberUndo();
  markerPreview = null;
  state.role = role;
  els.dmModeBtn.classList.toggle("active", role === "dm");
  els.playerModeBtn.classList.toggle("active", role === "player");
  els.roleBadge.textContent = role === "dm" ? "Modo DM" : "Modo jugadores";
  renderPoints();
  renderDetails();
  if (!options.skipSave) saveState();
}

function applyMapImage(options = {}) {
  setActiveModule("map", { skipSave: true });
  const activeMap = getActiveMap();
  const isSubmap = state.currentMapId !== "main";
  els.mapTitle.textContent = activeMap.name || "Mapa principal";
  els.mapNameInput.value = activeMap.name || "";
  els.mapContextBadge.textContent = isSubmap ? "Ciudad / ampliacion" : "Mapa mundial";
  els.mapUploadLabel.textContent = isSubmap ? "Cargar mapa de esta ciudad" : "Cargar mapa principal";
  els.backToMainBtn.hidden = !isSubmap && state.mapHistory.length === 0;
  els.emptyStateTitle.textContent = isSubmap ? `Carga el mapa de ${activeMap.name}` : "Carga tu mapa enorme";
  els.emptyStateText.textContent = isSubmap
    ? "Usa el boton de cargar mapa para poner la ciudad, mazmorra o ampliacion."
    : "Despues podras arrastrarlo, hacer zoom, poner puntos y trazar rutas.";
  els.emptyState.style.display = activeMap.image ? "none" : "grid";

  if (!activeMap.image) {
    els.mapImage.style.display = "none";
    els.canvas.style.width = `${activeMap.width}px`;
    els.canvas.style.height = `${activeMap.height}px`;
    els.routeLayer.setAttribute("width", activeMap.width);
    els.routeLayer.setAttribute("height", activeMap.height);
    renderAll();
    return;
  }

  els.mapImage.onload = () => {
    updateActiveMapSize(els.mapImage.naturalWidth, els.mapImage.naturalHeight);
    const loadedMap = getActiveMap();
    els.canvas.style.width = `${loadedMap.width}px`;
    els.canvas.style.height = `${loadedMap.height}px`;
    els.routeLayer.setAttribute("width", loadedMap.width);
    els.routeLayer.setAttribute("height", loadedMap.height);
    fitMap();
    renderAll();
    if (!options.skipSave) saveState();
  };
  els.mapImage.src = activeMap.image;
  els.mapImage.style.display = "block";
}

function fitMap() {
  const rect = els.viewport.getBoundingClientRect();
  const activeMap = getActiveMap();
  const scaleX = rect.width / activeMap.width;
  const scaleY = rect.height / activeMap.height;
  state.view.scale = Math.min(scaleX, scaleY, 1);
  state.view.x = Math.max(16, (rect.width - activeMap.width * state.view.scale) / 2);
  state.view.y = Math.max(16, (rect.height - activeMap.height * state.view.scale) / 2);
  applyTransform();
}

function applyTransform() {
  els.canvas.style.transform = `translate(${state.view.x}px, ${state.view.y}px) scale(${state.view.scale})`;
}

function viewportToMap(clientX, clientY) {
  const rect = els.viewport.getBoundingClientRect();
  return {
    x: (clientX - rect.left - state.view.x) / state.view.scale,
    y: (clientY - rect.top - state.view.y) / state.view.scale,
  };
}

function createPoint(x, y) {
  rememberUndo();
  const activeMap = getActiveMap();
  const point = {
    id: crypto.randomUUID(),
    mapId: state.currentMapId,
    x: clamp(x, 0, activeMap.width),
    y: clamp(y, 0, activeMap.height),
    title: "Nueva localizacion",
    description: "Escribe aqui lo que descubren los personajes.",
    hidden: false,
    color: "#d8aa47",
    icon: DEFAULT_MARKER_ICON,
    layer: "cities",
    submap: "",
  };
  state.points.push(point);
  state.selectedPointId = point.id;
  renderAll();
  saveState();
}

function addRoutePoint(x, y, label = "") {
  state.route.push({
    x,
    y,
    terrain: state.activeTerrain,
    label,
  });
  renderAll();
  saveState();
}

function renderAll() {
  renderLayerControls();
  renderPoints();
  renderRoute();
  renderLocationList();
  renderSavedRoutes();
  renderInitiative();
  renderDetails();
  updateRouteSummary();
  updateMeasureSummary();
}

function normalizeInitiativeIndex() {
  const total = state.initiative.combatants.length;
  if (!total) {
    state.initiative.activeIndex = 0;
    state.initiative.round = 1;
    return;
  }
  state.initiative.activeIndex = clamp(state.initiative.activeIndex, 0, total - 1);
  state.initiative.round = Math.max(1, state.initiative.round || 1);
}

function renderInitiative() {
  normalizeInitiativeIndex();
  renderSavedPlayerOptions();
  const combatants = state.initiative.combatants;
  const active = combatants[state.initiative.activeIndex];
  els.initiativeRound.textContent = `Ronda ${state.initiative.round}`;
  els.initiativeTurn.textContent = active ? `Turno: ${active.name}` : "Sin turno activo";
  els.initiativeList.innerHTML = "";

  if (!combatants.length) {
    const empty = document.createElement("div");
    empty.className = "summary";
    empty.textContent = "Anade participantes para empezar el combate.";
    els.initiativeList.appendChild(empty);
    return;
  }

  combatants.forEach((combatant, index) => {
    const hpNumber = Number(combatant.hp);
    const isDead = combatant.hp !== "" && Number.isFinite(hpNumber) && hpNumber <= 0;
    const row = document.createElement("article");
    row.className = "initiative-row";
    row.classList.toggle("active", index === state.initiative.activeIndex);
    row.classList.toggle("dead", isDead);
    row.dataset.initiativeId = combatant.id;

    const rank = document.createElement("span");
    rank.className = "initiative-rank";
    rank.textContent = combatant.initiative;

    const main = document.createElement("div");
    main.className = "initiative-main";
    const name = document.createElement("strong");
    const shouldShowNickname = combatant.type === "enemy" && combatant.nickname;
    name.textContent = shouldShowNickname ? `${combatant.name} (${combatant.nickname})` : combatant.name;
    const type = document.createElement("span");
    type.textContent = combatant.typeLabel || "Participante";
    main.append(name, type);
    if (isDead) {
      const deathMark = document.createElement("span");
      deathMark.className = "death-mark";
      deathMark.textContent = "Muerto";
      main.appendChild(deathMark);
    }
    if (combatant.type === "enemy") {
      const nickname = document.createElement("input");
      nickname.className = "initiative-nickname";
      nickname.type = "text";
      nickname.placeholder = "Mote";
      nickname.value = combatant.nickname || "";
      nickname.dataset.initiativeField = "nickname";
      main.appendChild(nickname);
    }

    const stats = document.createElement("div");
    stats.className = "initiative-stats";
    stats.append(
      createInitiativeStatInput("PG", combatant.hp, "hp"),
      createInitiativeStatInput("CA", combatant.ac, "ac"),
    );

    const remove = document.createElement("button");
    remove.className = "secondary icon-button initiative-delete";
    remove.type = "button";
    remove.title = "Borrar participante";
    remove.dataset.action = "deleteInitiative";
    remove.textContent = "x";

    row.append(rank, main, stats, remove);
    els.initiativeList.appendChild(row);
  });
}

function sortInitiative() {
  state.initiative.combatants.sort((a, b) => b.initiative - a.initiative || a.name.localeCompare(b.name));
  state.initiative.activeIndex = 0;
  state.initiative.round = 1;
}

function optionalNumber(value) {
  return value === "" ? "" : Number(value);
}

function updateInitiativeNicknameVisibility() {
  const isEnemy = els.initiativeTypeInput.value === "enemy";
  els.initiativeNicknameRow.hidden = !isEnemy;
  if (!isEnemy) els.initiativeNicknameInput.value = "";
}

function evaluateHpValue(value) {
  const expression = String(value).trim().replace(",", ".");
  if (!expression) return "";
  if (!/^[\d+\-*/().\s]+$/.test(expression)) {
    const parsed = Number(expression);
    return Number.isFinite(parsed) ? parsed : "";
  }
  try {
    const result = Function(`"use strict"; return (${expression});`)();
    return Number.isFinite(result) ? Math.floor(result) : "";
  } catch (error) {
    const parsed = Number(expression);
    return Number.isFinite(parsed) ? parsed : "";
  }
}

function createInitiativeStatInput(label, value, field) {
  const wrapper = document.createElement("label");
  wrapper.className = "initiative-stat-input";
  const text = document.createElement("span");
  text.textContent = label;
  const input = document.createElement("input");
  input.type = field === "hp" ? "text" : "number";
  if (field === "hp") input.inputMode = "decimal";
  input.step = "1";
  input.value = value ?? "";
  input.dataset.initiativeField = field;
  wrapper.append(text, input);
  return wrapper;
}

function renderSavedPlayerOptions() {
  const current = els.initiativeSavedPlayerSelect.value;
  els.initiativeSavedPlayerSelect.innerHTML = '<option value="">Nuevo participante</option>';
  state.initiative.savedPlayers
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach((player) => {
      const option = document.createElement("option");
      option.value = player.id;
      option.textContent = `${player.name} · PG ${player.hp ?? "-"} · CA ${player.ac ?? "-"}`;
      els.initiativeSavedPlayerSelect.appendChild(option);
    });
  els.initiativeSavedPlayerSelect.value = state.initiative.savedPlayers.some((player) => player.id === current) ? current : "";
}

function upsertSavedPlayerFromCombatant(combatant) {
  if (combatant.type !== "player") return;
  const name = combatant.name.trim();
  if (!name) return;
  let saved = state.initiative.savedPlayers.find((player) => player.id === combatant.savedPlayerId);
  if (!saved) {
    saved = state.initiative.savedPlayers.find((player) => player.name.toLowerCase() === name.toLowerCase());
  }
  if (!saved) {
    saved = { id: crypto.randomUUID(), name };
    state.initiative.savedPlayers.push(saved);
  }
  saved.name = name;
  saved.hp = combatant.hp ?? "";
  saved.ac = combatant.ac ?? "";
  combatant.savedPlayerId = saved.id;
}

function getUsedLayersForCurrentMap() {
  const counts = {};
  state.points.forEach((point) => {
    const pointMapId = point.mapId || "main";
    if (pointMapId !== state.currentMapId) return;
    if (state.role !== "dm" && point.hidden) return;
    const layer = point.layer || "cities";
    counts[layer] = (counts[layer] || 0) + 1;
  });
  return counts;
}

function renderLayerControls() {
  if (!els.layerControls) return;
  const counts = getUsedLayersForCurrentMap();
  const layers = Object.keys(layerRules).filter((layer) => counts[layer]);
  els.layerControls.innerHTML = "";

  if (!layers.length) {
    els.layerControls.innerHTML = '<div class="summary compact">Aun no hay capas con puntos en este mapa.</div>';
    return;
  }

  layers.forEach((layer) => {
    const rule = layerRules[layer] || layerRules.cities;
    const label = document.createElement("label");
    label.className = "toggle-row";
    label.innerHTML = `
      <input type="checkbox" data-layer-toggle="${layer}" ${state.visibleLayers[layer] !== false ? "checked" : ""} />
      <span>${rule.icon} ${rule.label} <small>${counts[layer]}</small></span>
    `;
    els.layerControls.appendChild(label);
  });
}

function beginPointDrag(event, point, marker) {
  if (state.role !== "dm" || state.toolMode === "route" || state.toolMode === "measure" || event.button !== 0) return;
  const activeMap = getActiveMap();
  if (!activeMap.image) return;
  event.preventDefault();
  event.stopPropagation();
  rememberUndo();
  pointDrag = {
    id: point.id,
    startClientX: event.clientX,
    startClientY: event.clientY,
    startX: point.x,
    startY: point.y,
    moved: false,
  };
  marker.setPointerCapture(event.pointerId);
  marker.classList.add("dragging");
}

function movePointDrag(event, point, marker) {
  if (!pointDrag || pointDrag.id !== point.id) return;
  event.preventDefault();
  event.stopPropagation();
  const activeMap = getActiveMap();
  const dx = (event.clientX - pointDrag.startClientX) / state.view.scale;
  const dy = (event.clientY - pointDrag.startClientY) / state.view.scale;
  if (Math.abs(dx) + Math.abs(dy) > 2) pointDrag.moved = true;
  point.x = clamp(pointDrag.startX + dx, 0, activeMap.width);
  point.y = clamp(pointDrag.startY + dy, 0, activeMap.height);
  marker.style.left = `${point.x}px`;
  marker.style.top = `${point.y}px`;
}

function endPointDrag(event, point, marker) {
  if (!pointDrag || pointDrag.id !== point.id) return;
  event.preventDefault();
  event.stopPropagation();
  const moved = pointDrag.moved;
  ignoreMarkerClick = moved;
  if (!moved) state.undoStack.pop();
  marker.classList.remove("dragging");
  if (marker.hasPointerCapture(event.pointerId)) marker.releasePointerCapture(event.pointerId);
  pointDrag = null;
  if (moved) {
    renderAll();
    saveState();
  }
}

function renderPoints() {
  els.pointLayer.innerHTML = "";
  const visiblePoints = state.points.filter((point) => {
    const pointMapId = point.mapId || "main";
    const presentation = getPointPresentation(point);
    const layer = presentation.layer || "cities";
    const isPreviewingPoint = markerPreview?.id === point.id && state.role === "dm";
    return pointMapId === state.currentMapId
      && (isPreviewingPoint || state.visibleLayers[layer] !== false)
      && (state.role === "dm" || !point.hidden);
  });

  visiblePoints.forEach((point) => {
    const marker = document.createElement("button");
    marker.className = "point";
    marker.type = "button";
    marker.title = point.title;
    marker.style.left = `${point.x}px`;
    marker.style.top = `${point.y}px`;
    const presentation = getPointPresentation(point);
    marker.style.setProperty("--marker-color", presentation.color || "#d8aa47");
    marker.innerHTML = renderIconMarkup(presentation.icon);
    marker.classList.toggle("has-icon", Boolean(presentation.icon));
    marker.classList.toggle("has-image-icon", isImageIcon(presentation.icon));
    marker.classList.toggle("hidden", point.hidden);
    marker.classList.toggle("selected", point.id === state.selectedPointId);
    marker.addEventListener("pointerdown", (event) => beginPointDrag(event, point, marker));
    marker.addEventListener("pointermove", (event) => movePointDrag(event, point, marker));
    marker.addEventListener("pointerup", (event) => endPointDrag(event, point, marker));
    marker.addEventListener("pointercancel", (event) => endPointDrag(event, point, marker));
    marker.addEventListener("click", (event) => {
      event.stopPropagation();
      if (ignoreMarkerClick) {
        ignoreMarkerClick = false;
        return;
      }
      if (state.toolMode === "route") {
        rememberUndo();
        addRoutePoint(point.x, point.y, point.title);
        return;
      }
      if (state.toolMode === "measure") {
        addMeasurePoint(point.x, point.y, point.title);
        return;
      }
      window.clearTimeout(markerClickTimer);
      markerClickTimer = window.setTimeout(() => {
        state.selectedPointId = point.id;
        renderAll();
      }, 180);
    });
    marker.addEventListener("dblclick", (event) => {
      event.preventDefault();
      event.stopPropagation();
      window.clearTimeout(markerClickTimer);
      if (state.toolMode === "route" || state.toolMode === "measure" || !canEnterSubmap(point)) return;
      enterSubmap(point);
    });
    els.pointLayer.appendChild(marker);
  });
}

function getPointPresentation(point) {
  if (markerPreview && markerPreview.id === point.id) {
    return {
      color: markerPreview.color,
      icon: markerPreview.icon,
      layer: markerPreview.layer,
    };
  }
  return {
    color: point.color || "#d8aa47",
    icon: point.icon || DEFAULT_MARKER_ICON,
    layer: point.layer || "cities",
  };
}

function isImageIcon(icon) {
  return /\.(png|jpe?g|gif|webp|svg)$/i.test(icon || "");
}

function renderIconMarkup(icon, fallback = "") {
  const value = icon || fallback || "";
  if (!value) return "";
  if (isImageIcon(value)) return `<img src="${escapeHtml(value)}" alt="" />`;
  return escapeHtml(value);
}

function previewSelectedPointMarker(point, dmView) {
  markerPreview = {
    id: point.id,
    color: dmView.elements.color.value || "#d8aa47",
    icon: dmView.elements.icon.value || DEFAULT_MARKER_ICON,
    layer: dmView.elements.layer.value || "cities",
  };
  renderPoints();
}

function getSelectedPoint() {
  return state.points.find((point) => point.id === state.selectedPointId && (point.mapId || "main") === state.currentMapId);
}

function getVisibleCurrentPoints() {
  const query = (els.locationSearch.value || "").trim().toLowerCase();
  return state.points
    .filter((point) => (point.mapId || "main") === state.currentMapId)
    .filter((point) => state.role === "dm" || !point.hidden)
    .filter((point) => state.visibleLayers[point.layer || "cities"] !== false)
    .filter((point) => {
      if (!query) return true;
      return `${point.title} ${point.description}`.toLowerCase().includes(query);
    })
    .sort((a, b) => a.title.localeCompare(b.title));
}

function renderLocationList() {
  if (!els.locationList) return;
  const points = getVisibleCurrentPoints();
  els.locationList.innerHTML = "";

  if (!points.length) {
    els.locationList.innerHTML = '<div class="summary compact">Sin localizaciones en este mapa.</div>';
    return;
  }

  points.forEach((point) => {
    const layer = layerRules[point.layer || "cities"] || layerRules.cities;
    const row = document.createElement("button");
    row.className = "item-row";
    row.type = "button";
    row.innerHTML = `
      <span class="item-mark">${renderIconMarkup(point.icon, layer.icon)}</span>
      <span><strong>${escapeHtml(point.title)}</strong><span>${layer.label}${point.hidden ? " / Oculto" : ""}</span></span>
      <span>${point.submap ? "Entrar" : ""}</span>
    `;
    row.addEventListener("click", () => {
      state.selectedPointId = point.id;
      setToolMode("explore");
      renderAll();
    });
    els.locationList.appendChild(row);
  });
}

function addMeasurePoint(x, y, label = "") {
  state.measureRoute.push({ x, y, label });
  renderAll();
  saveState();
}

function renderSavedRoutes() {
  if (!els.savedRouteSelect) return;
  const names = Object.keys(state.savedRoutes).sort((a, b) => a.localeCompare(b));
  els.savedRouteSelect.innerHTML = "";
  if (els.toggleSavedRoutesBtn) {
    els.toggleSavedRoutesBtn.textContent = state.showSavedRoutes ? "Ocultar" : "Mostrar";
    els.toggleSavedRoutesBtn.disabled = !names.length;
  }

  if (!names.length) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "Sin rutas guardadas";
    els.savedRouteSelect.appendChild(option);
    return;
  }

  names.forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name === state.activeSavedRoute ? `${name} *` : name;
    els.savedRouteSelect.appendChild(option);
  });
  if (state.activeSavedRoute && state.savedRoutes[state.activeSavedRoute]) {
    els.savedRouteSelect.value = state.activeSavedRoute;
  } else {
    state.activeSavedRoute = els.savedRouteSelect.value;
  }
}

function renderDetails() {
  const point = getSelectedPoint();
  const shouldShowDetails = Boolean(point) && !state.routeMode && !(state.role === "player" && point.hidden);
  els.detailsPanel.classList.toggle("has-selection", shouldShowDetails);
  els.appShell.classList.toggle("details-open", shouldShowDetails);

  if (!shouldShowDetails) {
    els.detailsPanel.innerHTML = '<div class="details-empty"><h2>Detalles</h2><p>Selecciona un punto del mapa para ver su descripcion.</p></div>';
    return;
  }

  const fragment = els.detailsTemplate.content.cloneNode(true);
  const root = fragment.querySelector(".details-content");
  const title = fragment.querySelector('[data-field="title"]');
  const playerView = fragment.querySelector('[data-view="player"]');
  const lockedView = fragment.querySelector('[data-view="locked"]');
  const dmView = fragment.querySelector('[data-view="dm"]');
  const description = fragment.querySelector('[data-field="description"]');
  const openSubmapBtns = fragment.querySelectorAll('[data-action="openSubmap"]');

  title.textContent = point.title;
  description.textContent = point.description || "Sin descripcion.";
  openSubmapBtns.forEach((button) => {
    button.hidden = !canEnterSubmap(point);
  });

  playerView.hidden = state.role !== "player" || point.hidden;
  lockedView.hidden = state.role !== "player" || !point.hidden;
  dmView.hidden = state.role !== "dm";

  if (state.role === "dm") {
    dmView.elements.title.value = point.title;
    dmView.elements.description.value = point.description;
    dmView.elements.color.value = point.color || "#d8aa47";
    dmView.elements.icon.value = point.icon || DEFAULT_MARKER_ICON;
    dmView.elements.layer.value = point.layer || "cities";
    [dmView.elements.color, dmView.elements.icon, dmView.elements.layer].forEach((input) => {
      input.addEventListener("input", () => previewSelectedPointMarker(point, dmView));
      input.addEventListener("change", () => previewSelectedPointMarker(point, dmView));
    });
  }

  fragment.querySelector('[data-action="close"]').addEventListener("click", () => {
    markerPreview = null;
    state.selectedPointId = null;
    renderAll();
  });

  dmView.addEventListener("submit", async (event) => {
    event.preventDefault();
    rememberUndo();
    point.title = dmView.elements.title.value.trim() || "Localizacion sin nombre";
    point.description = dmView.elements.description.value.trim();
    point.color = dmView.elements.color.value || "#d8aa47";
    point.icon = dmView.elements.icon.value || DEFAULT_MARKER_ICON;
    point.layer = dmView.elements.layer.value || "cities";
    markerPreview = null;

    renderAll();
    saveState();
  });

  fragment.querySelector('[data-action="delete"]').addEventListener("click", () => {
    if (!window.confirm("Borrar esta localizacion?")) return;
    rememberUndo();
    markerPreview = null;
    state.points = state.points.filter((candidate) => candidate.id !== point.id);
    state.selectedPointId = null;
    renderAll();
    saveState();
  });

  openSubmapBtns.forEach((button) => button.addEventListener("click", () => {
    enterSubmap(point);
  }));

  const toggleHiddenBtn = fragment.querySelector('[data-action="toggleHidden"]');
  if (toggleHiddenBtn) {
    toggleHiddenBtn.textContent = point.hidden ? "Mostrar" : "Ocultar";
    toggleHiddenBtn.addEventListener("click", () => {
      rememberUndo();
      point.hidden = !point.hidden;
      renderAll();
      saveState();
    });
  }

  els.detailsPanel.innerHTML = "";
  els.detailsPanel.appendChild(root);
}

function renderRoute() {
  els.routeLayer.innerHTML = "";
  document.querySelectorAll(".route-node").forEach((node) => node.remove());
  document.querySelectorAll(".measure-node").forEach((node) => node.remove());

  if (state.showSavedRoutes) {
    Object.entries(state.savedRoutes).forEach(([name, saved]) => {
      if (!saved || (saved.mapId || "main") !== state.currentMapId || !Array.isArray(saved.route) || saved.route.length < 2) return;
      if (name === state.activeSavedRoute && state.route.length > 1) return;
      const isSelectedSavedRoute = name === state.activeSavedRoute;
      drawRouteSegments(saved.route, {
        width: isSelectedSavedRoute ? 5 : 4,
        opacity: isSelectedSavedRoute ? 0.95 : 0.72,
        dashed: !isSelectedSavedRoute,
        label: name,
      });
    });
  }

  if (state.route.length > 1) {
    drawRouteSegments(state.route, { width: 5, opacity: 1, label: "Ruta actual" });
  }

  if (state.measureRoute.length > 1) {
    const measureLine = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    measureLine.setAttribute("points", state.measureRoute.map((point) => `${point.x},${point.y}`).join(" "));
    measureLine.setAttribute("fill", "none");
    measureLine.setAttribute("stroke", "#d8aa47");
    measureLine.setAttribute("stroke-width", "4");
    measureLine.setAttribute("stroke-dasharray", "8 8");
    measureLine.setAttribute("stroke-linecap", "round");
    measureLine.setAttribute("stroke-linejoin", "round");
    els.routeLayer.appendChild(measureLine);
  }

  state.route.forEach((point) => {
    const node = document.createElement("div");
    node.className = "route-node";
    node.style.left = `${point.x}px`;
    node.style.top = `${point.y}px`;
    els.canvas.appendChild(node);
  });

  state.measureRoute.forEach((point) => {
    const node = document.createElement("div");
    node.className = "route-node measure-node";
    node.style.left = `${point.x}px`;
    node.style.top = `${point.y}px`;
    els.canvas.appendChild(node);
  });
}

function drawRouteSegments(route, options = {}) {
  for (let index = 1; index < route.length; index += 1) {
    const previous = route[index - 1];
    const current = route[index];
    const terrain = terrainRules[current.terrain] || terrainRules.plain;
    const segment = document.createElementNS("http://www.w3.org/2000/svg", "line");
    segment.setAttribute("x1", previous.x);
    segment.setAttribute("y1", previous.y);
    segment.setAttribute("x2", current.x);
    segment.setAttribute("y2", current.y);
    segment.setAttribute("stroke", terrain.color);
    segment.setAttribute("stroke-width", options.width || 5);
    segment.setAttribute("stroke-linecap", "round");
    segment.setAttribute("opacity", options.opacity ?? 1);
    if (options.dashed) segment.setAttribute("stroke-dasharray", "10 7");
    if (options.label) segment.setAttribute("aria-label", `${options.label}: ${terrain.label}`);
    els.routeLayer.appendChild(segment);
  }
}

function getRouteSummaryHtml(route) {
  const kmPerPixel = Number(els.kmPerPixelInput.value) * Number(els.scaleInput.value);
  const speed = Number(els.speedInput.value);
  const movement = speedPresets[state.speedPreset]?.label || "Personalizada";
  let distance = 0;
  let weightedDistance = 0;
  const terrainTotals = {};

  for (let index = 1; index < route.length; index += 1) {
    const previous = route[index - 1];
    const current = route[index];
    const segmentPixels = Math.hypot(current.x - previous.x, current.y - previous.y);
    const segmentKm = segmentPixels * kmPerPixel;
    const terrain = terrainRules[current.terrain] || terrainRules.plain;
    distance += segmentKm;
    weightedDistance += segmentKm * terrain.multiplier;
    terrainTotals[current.terrain] = (terrainTotals[current.terrain] || 0) + segmentKm;
  }

  const days = weightedDistance / speed;
  const terrainText = Object.entries(terrainTotals)
    .map(([terrain, km]) => {
      const rule = terrainRules[terrain] || terrainRules.plain;
      return `<span><i style="--terrain-color: ${rule.color}"></i>${rule.label} x${rule.multiplier}: ${km.toFixed(1)} km</span>`;
    })
    .join("");
  const startLabel = route[0]?.label ? `Desde: <strong>${escapeHtml(route[0].label)}</strong><br>` : "";
  const endLabel = route.at(-1)?.label ? `Hasta: <strong>${escapeHtml(route.at(-1).label)}</strong><br>` : "";

  return `
    ${startLabel}${endLabel}
    <strong>${distance.toFixed(1)} km</strong><br>
    Movimiento: <strong>${movement}</strong><br>
    Tiempo estimado: <strong>${formatDays(days)}</strong>
    <div class="terrain-breakdown">${terrainText}</div>
  `;
}

function updateRouteSummary() {
  if (state.route.length >= 2) {
    els.routeSummary.innerHTML = getRouteSummaryHtml(state.route);
    return;
  }

  const selectedSavedRoute = state.savedRoutes[state.activeSavedRoute];
  if (selectedSavedRoute && Array.isArray(selectedSavedRoute.route) && selectedSavedRoute.route.length >= 2) {
    els.routeSummary.innerHTML = getRouteSummaryHtml(selectedSavedRoute.route);
    return;
  }

  els.routeSummary.textContent = "Sin ruta todavia.";
}

function updateMeasureSummary() {
  if (!els.measureSummary) return;
  if (state.measureRoute.length < 2) {
    els.measureSummary.textContent = "Sin medicion.";
    return;
  }

  const kmPerPixel = Number(els.kmPerPixelInput.value) * Number(els.scaleInput.value);
  let distance = 0;
  for (let index = 1; index < state.measureRoute.length; index += 1) {
    const previous = state.measureRoute[index - 1];
    const current = state.measureRoute[index];
    distance += Math.hypot(current.x - previous.x, current.y - previous.y) * kmPerPixel;
  }
  els.measureSummary.innerHTML = `Medicion rapida: <strong>${distance.toFixed(1)} km</strong>`;
}

function formatDays(days) {
  if (days < 1) return `${Math.max(1, Math.round(days * 24))} horas`;
  const wholeDays = Math.floor(days);
  const hours = Math.round((days - wholeDays) * 24);
  return hours ? `${wholeDays} dias y ${hours} horas` : `${wholeDays} dias`;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function zoomBy(factor) {
  const rect = els.viewport.getBoundingClientRect();
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  const before = {
    x: (centerX - state.view.x) / state.view.scale,
    y: (centerY - state.view.y) / state.view.scale,
  };
  state.view.scale = clamp(state.view.scale * factor, 0.1, 6);
  state.view.x = centerX - before.x * state.view.scale;
  state.view.y = centerY - before.y * state.view.scale;
  applyTransform();
}

function exportCampaign() {
  const data = JSON.stringify({
    ...getCampaignData(),
    setups: state.setups,
  }, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "campana-dnd-atlas.json";
  link.click();
  URL.revokeObjectURL(url);
}

async function importCampaign(file) {
  const text = await file.text();
  const data = JSON.parse(text);
  rememberUndo();
  applyCampaignData({
    ...data,
    currentMapId: "main",
    mapHistory: [],
    route: [],
  });
  if (data.setups && typeof data.setups === "object") {
    state.setups = data.setups;
    await saveSetups();
  }
  state.selectedPointId = null;
  applyMapImage();
  saveState();
}

els.dmModeBtn.addEventListener("click", () => setRole("dm"));
els.playerModeBtn.addEventListener("click", () => setRole("player"));
els.sidebarToggleBtn.addEventListener("click", () => {
  state.sidebarCollapsed = !state.sidebarCollapsed;
  applySidebarState();
  saveState();
});

document.querySelectorAll(".module-button").forEach((button) => {
  button.addEventListener("click", () => setActiveModule(button.dataset.module));
});

document.querySelectorAll(".tab-button").forEach((button) => {
  button.addEventListener("click", () => setActiveTab(button.dataset.tab));
});

document.querySelectorAll(".tool-button").forEach((button) => {
  button.addEventListener("click", () => setToolMode(button.dataset.tool));
});

els.mapUpload.addEventListener("change", async () => {
  const file = els.mapUpload.files[0];
  if (!file) return;
  rememberUndo();
  const image = await fileToDataUrl(file);
  if (state.currentMapId === "main") {
    state.map = {
      id: "main",
      name: els.mapNameInput.value.trim() || file.name.replace(/\.[^.]+$/, ""),
      image,
      width: state.map.width,
      height: state.map.height,
    };
  } else {
    const owner = getSubmapOwner();
    if (owner) {
      owner.submap = image;
      owner.submapWidth = owner.submapWidth || 1600;
      owner.submapHeight = owner.submapHeight || 1000;
    }
  }
  state.route = [];
  applyMapImage();
  saveState();
  els.mapUpload.value = "";
});

els.saveMapNameBtn.addEventListener("click", () => {
  rememberUndo();
  if (state.currentMapId === "main") {
    state.map.name = els.mapNameInput.value.trim() || "Mapa principal";
  } else {
    const owner = getSubmapOwner();
    if (owner) owner.title = els.mapNameInput.value.trim() || owner.title || "Ciudad sin nombre";
  }
  applyMapImage();
  saveState();
});

els.goMainMapBtn.addEventListener("click", goMainMap);
els.resetViewBtn.addEventListener("click", fitMap);
els.backToMainBtn.addEventListener("click", () => {
  goBackMap();
});
els.zoomInBtn.addEventListener("click", () => zoomBy(1.2));
els.zoomOutBtn.addEventListener("click", () => zoomBy(0.85));
els.exportBtn.addEventListener("click", exportCampaign);
els.importInput.addEventListener("change", () => {
  const file = els.importInput.files[0];
  if (file) importCampaign(file);
});

els.saveSetupBtn.addEventListener("click", () => {
  const name = els.setupNameInput.value.trim() || "Setup sin nombre";
  state.setups[name] = currentSetup();
  els.setupNameInput.value = name;
  saveSetups();
  els.setupSelect.value = name;
});

els.loadSetupBtn.addEventListener("click", () => {
  applySetup(state.setups[els.setupSelect.value]);
});

els.deleteSetupBtn.addEventListener("click", () => {
  const name = els.setupSelect.value;
  if (!name) return;
  if (!window.confirm(`Borrar el setup "${name}"?`)) return;
  delete state.setups[name];
  saveSetups();
});

els.locationSearch.addEventListener("input", renderLocationList);

els.layerControls.addEventListener("change", (event) => {
  const input = event.target.closest("[data-layer-toggle]");
  if (!input) return;
  rememberUndo();
  state.visibleLayers[input.dataset.layerToggle] = input.checked;
  renderAll();
  saveState();
});

els.routeModeBtn.addEventListener("click", () => {
  setToolMode(state.toolMode === "route" ? "explore" : "route");
});

els.clearRouteBtn.addEventListener("click", () => {
  if (state.route.length && !window.confirm("Limpiar la ruta actual?")) return;
  rememberUndo();
  state.route = [];
  renderAll();
  saveState();
});

els.measureModeBtn.addEventListener("click", () => {
  setToolMode(state.toolMode === "measure" ? "explore" : "measure");
});

els.clearMeasureBtn.addEventListener("click", () => {
  rememberUndo();
  state.measureRoute = [];
  updateMeasureSummary();
  renderAll();
  saveState();
});

els.saveRouteBtn.addEventListener("click", () => {
  if (state.route.length < 2) return;
  rememberUndo();
  const name = els.routeNameInput.value.trim() || `Ruta ${Object.keys(state.savedRoutes).length + 1}`;
  state.savedRoutes[name] = {
    mapId: state.currentMapId,
    route: JSON.parse(JSON.stringify(state.route)),
    createdAt: new Date().toISOString(),
  };
  state.activeSavedRoute = name;
  state.showSavedRoutes = true;
  state.route = [];
  els.routeNameInput.value = "";
  renderAll();
  saveState();
});

els.loadRouteBtn.addEventListener("click", () => {
  const name = els.savedRouteSelect.value;
  const saved = state.savedRoutes[name];
  if (!saved) return;
  rememberUndo();
  state.activeSavedRoute = name;
  if (saved.mapId && saved.mapId !== state.currentMapId) state.currentMapId = saved.mapId;
  state.route = JSON.parse(JSON.stringify(saved.route || []));
  setActiveTab("routes");
  applyMapImage();
  saveState();
});

els.savedRouteSelect.addEventListener("change", () => {
  state.activeSavedRoute = els.savedRouteSelect.value;
  if (state.activeSavedRoute) state.showSavedRoutes = true;
  renderAll();
  saveState();
});

els.toggleSavedRoutesBtn.addEventListener("click", () => {
  rememberUndo();
  state.showSavedRoutes = !state.showSavedRoutes;
  renderAll();
  saveState();
});

els.deleteRouteBtn.addEventListener("click", () => {
  const name = els.savedRouteSelect.value;
  if (!name || !state.savedRoutes[name]) return;
  if (!window.confirm(`Borrar la ruta "${name}"?`)) return;
  delete state.savedRoutes[name];
  if (state.activeSavedRoute === name) state.activeSavedRoute = "";
  renderAll();
  saveState();
});

els.initiativeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = els.initiativeNameInput.value.trim();
  if (!name) return;
  rememberUndo();
  const typeLabels = {
    player: "Jugador",
    enemy: "Enemigo",
    ally: "Aliado",
  };
  const selectedSavedPlayer = state.initiative.savedPlayers.find((player) => player.id === els.initiativeSavedPlayerSelect.value);
  const combatant = {
    id: crypto.randomUUID(),
    savedPlayerId: selectedSavedPlayer?.id || "",
    name,
    nickname: els.initiativeTypeInput.value === "enemy" ? els.initiativeNicknameInput.value.trim() : "",
    initiative: Number(els.initiativeValueInput.value) || 0,
    hp: evaluateHpValue(els.initiativeHpInput.value),
    ac: optionalNumber(els.initiativeAcInput.value),
    type: els.initiativeTypeInput.value,
    typeLabel: typeLabels[els.initiativeTypeInput.value] || "Participante",
  };
  upsertSavedPlayerFromCombatant(combatant);
  state.initiative.combatants.push(combatant);
  sortInitiative();
  els.initiativeSavedPlayerSelect.value = "";
  els.initiativeNameInput.value = "";
  els.initiativeNicknameInput.value = "";
  els.initiativeValueInput.value = "";
  els.initiativeHpInput.value = "";
  els.initiativeAcInput.value = "";
  renderInitiative();
  saveState();
});

els.initiativeSavedPlayerSelect.addEventListener("change", () => {
  const savedPlayer = state.initiative.savedPlayers.find((player) => player.id === els.initiativeSavedPlayerSelect.value);
  if (!savedPlayer) return;
  els.initiativeTypeInput.value = "player";
  els.initiativeNameInput.value = savedPlayer.name;
  els.initiativeNicknameInput.value = "";
  els.initiativeHpInput.value = savedPlayer.hp ?? "";
  els.initiativeAcInput.value = savedPlayer.ac ?? "";
  els.initiativeNameInput.focus();
  updateInitiativeNicknameVisibility();
});

els.initiativeTypeInput.addEventListener("change", updateInitiativeNicknameVisibility);

els.initiativeHpInput.addEventListener("change", () => {
  const hp = evaluateHpValue(els.initiativeHpInput.value);
  els.initiativeHpInput.value = hp ?? "";
});

els.initiativeSortBtn.addEventListener("click", () => {
  rememberUndo();
  sortInitiative();
  renderInitiative();
  saveState();
});

els.initiativeNextBtn.addEventListener("click", () => {
  if (!state.initiative.combatants.length) return;
  rememberUndo();
  state.initiative.activeIndex += 1;
  if (state.initiative.activeIndex >= state.initiative.combatants.length) {
    state.initiative.activeIndex = 0;
    state.initiative.round += 1;
  }
  renderInitiative();
  saveState();
});

els.initiativeResetBtn.addEventListener("click", () => {
  rememberUndo();
  state.initiative.activeIndex = 0;
  state.initiative.round = 1;
  renderInitiative();
  saveState();
});

els.initiativeClearBtn.addEventListener("click", () => {
  if (state.initiative.combatants.length && !window.confirm("Limpiar toda la iniciativa?")) return;
  rememberUndo();
  state.initiative.combatants = [];
  state.initiative.activeIndex = 0;
  state.initiative.round = 1;
  renderInitiative();
  saveState();
});

els.initiativeList.addEventListener("click", (event) => {
  const deleteButton = event.target.closest('[data-action="deleteInitiative"]');
  const row = event.target.closest("[data-initiative-id]");
  if (event.target.closest("[data-initiative-field]")) return;
  if (!row) return;
  const index = state.initiative.combatants.findIndex((combatant) => combatant.id === row.dataset.initiativeId);
  if (index === -1) return;
  rememberUndo();
  if (deleteButton) {
    state.initiative.combatants.splice(index, 1);
    if (state.initiative.activeIndex >= state.initiative.combatants.length) {
      state.initiative.activeIndex = Math.max(0, state.initiative.combatants.length - 1);
    }
  } else {
    state.initiative.activeIndex = index;
  }
  renderInitiative();
  saveState();
});

els.initiativeList.addEventListener("input", (event) => {
  const input = event.target.closest("[data-initiative-field]");
  const row = event.target.closest("[data-initiative-id]");
  if (!input || !row) return;
  const combatant = state.initiative.combatants.find((candidate) => candidate.id === row.dataset.initiativeId);
  if (!combatant) return;
  const field = input.dataset.initiativeField;
  if (field === "hp") return;
  if (field === "nickname" && combatant.type !== "enemy") return;
  combatant[field] = field === "nickname" ? input.value.trim() : optionalNumber(input.value);
  upsertSavedPlayerFromCombatant(combatant);
  renderSavedPlayerOptions();
  saveState();
});

els.initiativeList.addEventListener("change", (event) => {
  const input = event.target.closest("[data-initiative-field]");
  const row = event.target.closest("[data-initiative-id]");
  if (!input || !row) return;
  const combatant = state.initiative.combatants.find((candidate) => candidate.id === row.dataset.initiativeId);
  if (!combatant) return;
  const field = input.dataset.initiativeField;
  if (field === "hp") {
    combatant.hp = evaluateHpValue(input.value);
    input.value = combatant.hp ?? "";
  } else if (field === "nickname") {
    if (combatant.type !== "enemy") return;
    combatant.nickname = input.value.trim();
  } else {
    combatant[field] = optionalNumber(input.value);
  }
  upsertSavedPlayerFromCombatant(combatant);
  renderInitiative();
  saveState();
});

document.querySelectorAll(".terrain").forEach((button) => {
  button.addEventListener("click", () => {
    if (state.activeTerrain !== button.dataset.terrain) rememberUndo();
    state.activeTerrain = button.dataset.terrain;
    document.querySelectorAll(".terrain").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    saveState();
  });
});

[els.scaleInput, els.kmPerPixelInput, els.speedInput].forEach((input) => {
  input.addEventListener("input", () => {
    if (input === els.speedInput) {
      const selected = speedPresets[state.speedPreset];
      if (!selected || Number(els.speedInput.value) !== selected.speed) {
        state.speedPreset = "custom";
        els.speedPresetSelect.value = "custom";
      }
    }
    updateRouteSummary();
    saveState();
  });
});

els.speedPresetSelect.addEventListener("change", () => {
  rememberUndo();
  state.speedPreset = els.speedPresetSelect.value;
  const preset = speedPresets[state.speedPreset];
  if (preset && state.speedPreset !== "custom") {
    els.speedInput.value = preset.speed;
  }
  updateRouteSummary();
  saveState();
});

els.viewport.addEventListener("pointerdown", (event) => {
  if (event.target.closest(".point")) return;
  const canPan = state.spacePan || event.button === 1;
  if (!canPan) return;
  event.preventDefault();
  drag = {
    startX: event.clientX,
    startY: event.clientY,
    viewX: state.view.x,
    viewY: state.view.y,
  };
  els.viewport.setPointerCapture(event.pointerId);
  els.viewport.classList.add("dragging");
});

els.viewport.addEventListener("pointermove", (event) => {
  if (!drag) return;
  const dx = event.clientX - drag.startX;
  const dy = event.clientY - drag.startY;
  if (Math.abs(dx) + Math.abs(dy) > 4) ignoreClick = true;
  state.view.x = drag.viewX + dx;
  state.view.y = drag.viewY + dy;
  applyTransform();
});

els.viewport.addEventListener("pointerup", (event) => {
  if (!drag) return;
  els.viewport.releasePointerCapture(event.pointerId);
  els.viewport.classList.remove("dragging");
  drag = null;
  setTimeout(() => {
    ignoreClick = false;
  }, 0);
});

els.viewport.addEventListener("wheel", (event) => {
  event.preventDefault();
  zoomBy(event.deltaY < 0 ? 1.1 : 0.9);
}, { passive: false });

els.viewport.addEventListener("click", (event) => {
  const activeMap = getActiveMap();
  if (ignoreClick || !activeMap.image) return;
  const target = event.target;
  if (target.closest(".point")) return;

  const position = viewportToMap(event.clientX, event.clientY);
  if (position.x < 0 || position.y < 0 || position.x > activeMap.width || position.y > activeMap.height) return;

  if (state.toolMode === "route") {
    rememberUndo();
    addRoutePoint(position.x, position.y);
    return;
  }

  if (state.toolMode === "measure") {
    addMeasurePoint(position.x, position.y);
    return;
  }

  if (state.role === "dm" && (event.shiftKey || state.toolMode === "edit")) {
    createPoint(position.x, position.y);
    return;
  }

  state.selectedPointId = null;
  renderAll();
});

els.viewport.addEventListener("auxclick", (event) => {
  if (event.button === 1) event.preventDefault();
});

window.addEventListener("keydown", (event) => {
  const isFormControl = event.target.closest?.("input, textarea, select");
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z" && !isFormControl) {
    event.preventDefault();
    undoLastChange();
    return;
  }

  if (event.code !== "Space" || event.target.closest?.("input, textarea, select")) return;
  event.preventDefault();
  state.spacePan = true;
  updatePanCursor();
});

window.addEventListener("keyup", (event) => {
  if (event.code !== "Space") return;
  state.spacePan = false;
  updatePanCursor();
});

window.addEventListener("resize", () => {
  applyTransform();
});

async function initApp() {
  await loadState();
  await loadSetups();
  setRole(state.role, { skipSave: true });
  applySidebarState();
  updateInitiativeNicknameVisibility();
  updatePanCursor();
  applyMapImage({ skipSave: true });
}

initApp();
