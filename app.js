const LEGACY_AUTH_STORAGE_KEY = "consultas_auth_users_v1";
const LEGACY_MIGRATION_PREFIX = "consultas_legacy_migrated_v2_";
const MS_HOUR = 60 * 60 * 1000;
const DEFAULT_PAUSE_THRESHOLD_MIN = 20;
const MIN_CONSULTS_FOR_AVERAGES = 5;

const TYPE_META = {
  adulto: { label: "Adulto", price: 15, color: "#2f855a" },
  pediatria: { label: "Pediatria", price: 20, color: "#dd6b20" },
  one: { label: "One", price: 20, color: "#0f766e" },
  plantao: { label: "Plantão", price: 20, color: "#1d4ed8" },
};

const TYPE_KEYS = Object.keys(TYPE_META);
const PRESET_IMPORT_ID = "atendimentos_2026-02-21_numbers_v1";
const TODAY_PRESET_IMPORT_ID = "atendimentos_2026-02-22_numbers_v1";
const TODAY_FORCE_PLANTAO_ID = "force_today_records_to_plantao_v1";
const ADMIN_TODAY_FILE_IMPORT_ID = "admin_today_file_import_v1";
const ADMIN_NUMBERS_IMPORT_ID = "admin_numbers_attend_v1";
const ADMIN_NUMBERS_DAILY_COUNTS = [
  { dayKey: "2026-02-22", adulto: 0, plantao: 60 },
  { dayKey: "2026-02-21", adulto: 48, plantao: 30 },
  { dayKey: "2026-02-20", adulto: 40, plantao: 30 },
  { dayKey: "2026-02-19", adulto: 28, plantao: 19 },
  { dayKey: "2026-02-18", adulto: 25, plantao: 22 },
  { dayKey: "2026-02-17", adulto: 8, plantao: 1 },
  { dayKey: "2026-02-16", adulto: 52, plantao: 11 },
  { dayKey: "2026-02-15", adulto: 0, plantao: 60 },
  { dayKey: "2026-02-14", adulto: 17, plantao: 13 },
  { dayKey: "2026-02-13", adulto: 24, plantao: 26 },
  { dayKey: "2026-02-12", adulto: 5, plantao: 12 },
  { dayKey: "2026-02-11", adulto: 27, plantao: 23 },
  { dayKey: "2026-02-10", adulto: 33, plantao: 17 },
  { dayKey: "2026-02-09", adulto: 21, plantao: 21 },
  { dayKey: "2026-02-08", adulto: 0, plantao: 60 },
  { dayKey: "2026-02-04", adulto: 27, plantao: 24 },
  { dayKey: "2026-02-03", adulto: 20, plantao: 20 },
  { dayKey: "2026-02-02", adulto: 26, plantao: 21 },
  { dayKey: "2026-02-01", adulto: 0, plantao: 60 },
];
const YESTERDAY_IMPORT_ROWS = [
  { time: "08:30", type: "adulto" },
  { time: "08:34", type: "adulto" },
  { time: "08:39", type: "one" },
  { time: "08:44", type: "adulto" },
  { time: "08:50", type: "pediatria" },
  { time: "08:56", type: "adulto" },
  { time: "09:00", type: "adulto" },
  { time: "09:06", type: "one" },
  { time: "09:11", type: "adulto" },
  { time: "09:22", type: "adulto" },
  { time: "09:25", type: "adulto" },
  { time: "09:28", type: "adulto" },
  { time: "09:35", type: "pediatria" },
  { time: "09:42", type: "pediatria" },
  { time: "09:50", type: "adulto" },
  { time: "09:54", type: "pediatria" },
  { time: "10:01", type: "pediatria" },
  { time: "10:09", type: "adulto" },
  { time: "10:14", type: "adulto" },
  { time: "10:20", type: "pediatria" },
  { time: "10:27", type: "adulto" },
  { time: "10:38", type: "one" },
  { time: "10:46", type: "pediatria" },
  { time: "10:53", type: "pediatria" },
  { time: "10:59", type: "adulto" },
  { time: "11:04", type: "adulto" },
  { time: "11:11", type: "pediatria" },
  { time: "11:15", type: "pediatria" },
  { time: "11:23", type: "one" },
  { time: "11:28", type: "pediatria" },
  { time: "11:35", type: "adulto" },
  { time: "11:42", type: "one" },
  { time: "11:48", type: "adulto" },
  { time: "11:53", type: "pediatria" },
  { time: "11:58", type: "one" },
  { time: "12:03", type: "pediatria" },
  { time: "12:06", type: "adulto" },
  { time: "12:12", type: "adulto" },
  { time: "12:18", type: "adulto" },
  { time: "12:27", type: "adulto" },
  { time: "12:30", type: "adulto" },
  { time: "12:36", type: "adulto" },
  { time: "12:42", type: "one" },
  { time: "14:17", type: "one" },
  { time: "14:20", type: "adulto" },
  { time: "14:22", type: "pediatria" },
  { time: "14:27", type: "one" },
  { time: "14:32", type: "adulto" },
  { time: "14:38", type: "pediatria" },
  { time: "14:43", type: "pediatria" },
  { time: "14:49", type: "pediatria" },
  { time: "14:57", type: "pediatria" },
  { time: "15:04", type: "pediatria" },
  { time: "15:09", type: "pediatria" },
  { time: "15:17", type: "adulto" },
  { time: "15:31", type: "pediatria" },
  { time: "16:34", type: "one" },
  { time: "16:37", type: "adulto" },
  { time: "16:49", type: "adulto" },
  { time: "16:54", type: "pediatria" },
  { time: "17:00", type: "adulto" },
  { time: "17:04", type: "adulto" },
  { time: "17:08", type: "adulto" },
  { time: "17:13", type: "pediatria" },
  { time: "17:19", type: "adulto" },
  { time: "17:23", type: "pediatria" },
  { time: "17:28", type: "adulto" },
  { time: "21:06", type: "adulto" },
  { time: "21:09", type: "adulto" },
  { time: "21:11", type: "adulto" },
  { time: "21:15", type: "adulto" },
  { time: "21:20", type: "adulto" },
  { time: "21:27", type: "adulto" },
  { time: "21:30", type: "adulto" },
  { time: "21:36", type: "adulto" },
];
const TODAY_IMPORT_ROWS = [
  { time: "07:22", type: "plantao" },
  { time: "07:26", type: "plantao" },
  { time: "07:30", type: "plantao" },
  { time: "07:36", type: "plantao" },
  { time: "07:42", type: "plantao" },
  { time: "07:46", type: "plantao" },
  { time: "08:08", type: "plantao" },
  { time: "08:12", type: "plantao" },
  { time: "08:21", type: "plantao" },
  { time: "08:26", type: "plantao" },
  { time: "08:33", type: "plantao" },
  { time: "08:37", type: "plantao" },
  { time: "08:47", type: "plantao" },
  { time: "08:52", type: "plantao" },
  { time: "08:57", type: "plantao" },
  { time: "09:01", type: "plantao" },
  { time: "09:11", type: "plantao" },
  { time: "09:16", type: "plantao" },
  { time: "09:22", type: "plantao" },
  { time: "09:28", type: "plantao" },
  { time: "09:35", type: "plantao" },
  { time: "09:39", type: "plantao" },
  { time: "09:44", type: "plantao" },
  { time: "09:48", type: "plantao" },
  { time: "09:55", type: "plantao" },
  { time: "10:00", type: "plantao" },
  { time: "10:06", type: "plantao" },
  { time: "10:12", type: "plantao" },
  { time: "10:17", type: "plantao" },
  { time: "10:21", type: "plantao" },
  { time: "10:25", type: "plantao" },
  { time: "10:30", type: "plantao" },
  { time: "10:37", type: "plantao" },
  { time: "10:44", type: "plantao" },
  { time: "10:52", type: "plantao" },
  { time: "11:02", type: "plantao" },
  { time: "11:11", type: "plantao" },
  { time: "11:21", type: "plantao" },
  { time: "11:30", type: "plantao" },
  { time: "11:41", type: "plantao" },
  { time: "11:46", type: "plantao" },
  { time: "11:49", type: "plantao" },
  { time: "11:54", type: "plantao" },
  { time: "11:59", type: "plantao" },
  { time: "12:04", type: "plantao" },
  { time: "12:20", type: "plantao" },
  { time: "12:28", type: "plantao" },
  { time: "12:32", type: "plantao" },
  { time: "12:37", type: "plantao" },
  { time: "12:40", type: "plantao" },
  { time: "14:48", type: "plantao" },
  { time: "14:55", type: "plantao" },
  { time: "14:59", type: "plantao" },
  { time: "15:02", type: "plantao" },
  { time: "15:07", type: "plantao" },
  { time: "15:12", type: "plantao" },
  { time: "15:23", type: "plantao" },
  { time: "15:28", type: "plantao" },
  { time: "15:35", type: "plantao" },
  { time: "15:40", type: "plantao" },
];

const state = {
  data: createEmptyData(),
  currentUserEmail: null,
  currentUserRole: null,
  selectedDateKey: toDayKey(new Date()),
  calendarCursor: startOfMonth(new Date()),
  editingRecordId: null,
  saveQueue: Promise.resolve(),
  adminSummaryCache: {},
  adminSummaryLoading: {},
  adminSummaryError: {},
  hourlyModal: {
    isOpen: false,
    focusMetric: "netRevenuePerHour",
  },
  charts: {
    day: null,
    week: null,
    month: null,
    hourly: null,
  },
};

function createEmptyData() {
  return {
    days: {},
    settings: {
      targetHours: 8,
      pauseThresholdMin: DEFAULT_PAUSE_THRESHOLD_MIN,
      monthlyGoals: {},
      completedImports: [],
    },
  };
}

function normalizeData(parsed) {
  const fallback = createEmptyData();
  const days = {};
  for (const [key, value] of Object.entries(parsed?.days || {})) {
    if (!Array.isArray(value)) continue;
    const clean = value
      .map((r) => ({
        id: r.id || createId(),
        type: TYPE_META[r.type] ? r.type : null,
        ts: Number(r.ts),
      }))
      .filter((r) => r.type && Number.isFinite(r.ts))
      .sort((a, b) => a.ts - b.ts);
    if (clean.length > 0) days[key] = clean;
  }
  const targetHours = Number(parsed?.settings?.targetHours);
  const pauseThresholdMin = Number(parsed?.settings?.pauseThresholdMin);
  const monthlyGoalsRaw = parsed?.settings?.monthlyGoals;
  const monthlyGoals = {};
  if (monthlyGoalsRaw && typeof monthlyGoalsRaw === "object") {
    for (const [monthKey, goal] of Object.entries(monthlyGoalsRaw)) {
      const parsedGoal = Number(goal);
      if (/^\d{4}-\d{2}$/.test(monthKey) && Number.isFinite(parsedGoal) && parsedGoal >= 0) {
        monthlyGoals[monthKey] = parsedGoal;
      }
    }
  }
  const completedImports = Array.isArray(parsed?.settings?.completedImports)
    ? parsed.settings.completedImports.filter((item) => typeof item === "string")
    : [];
  return {
    days,
    settings: {
      targetHours: Number.isFinite(targetHours) && targetHours > 0 ? targetHours : 8,
      pauseThresholdMin:
        Number.isFinite(pauseThresholdMin) && pauseThresholdMin > 0
          ? pauseThresholdMin
          : DEFAULT_PAUSE_THRESHOLD_MIN,
      monthlyGoals,
      completedImports,
    },
  };
}

function cloneData(data) {
  return JSON.parse(JSON.stringify(data));
}

function hasAnyDayRecord(data) {
  return Object.values(data?.days || {}).some((records) => Array.isArray(records) && records.length > 0);
}

function getLegacyDataForUser(email) {
  const emailKey = String(email || "")
    .trim()
    .toLowerCase();
  if (!emailKey) return null;

  try {
    const raw = localStorage.getItem(LEGACY_AUTH_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    const user = parsed?.users?.[emailKey];
    if (user?.data) {
      const normalized = normalizeData(user.data);
      if (hasAnyDayRecord(normalized)) return normalized;
    }
  } catch (err) {
    console.error("Erro ao ler usuários legados para migração:", err);
  }
  return null;
}

async function apiRequest(path, { method = "GET", body } = {}) {
  const options = {
    method,
    credentials: "include",
    headers: {},
  };

  if (body !== undefined) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`/api${path}`, options);
  let payload = null;
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    payload = await response.json().catch(() => null);
  }

  if (!response.ok) {
    throw new Error(payload?.message || `Erro ${response.status}`);
  }

  return payload || {};
}

function saveData() {
  if (!state.currentUserEmail) return;

  const snapshot = cloneData(state.data);
  state.saveQueue = state.saveQueue
    .then(() => apiRequest("/data/save", { method: "PUT", body: { data: snapshot } }))
    .catch((err) => {
      console.error("Erro ao salvar dados no servidor:", err);
    });
}

async function flushSaveQueue() {
  await state.saveQueue.catch(() => {});
}

function createId() {
  if (window.crypto?.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function toDayKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseDayKey(key) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function monthKeyFromDayKey(dayKey) {
  return dayKey.slice(0, 7);
}

function toTimestampFromDayAndTime(dayKey, hhmm) {
  const [year, month, day] = dayKey.split("-").map(Number);
  const [hours, minutes] = hhmm.split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes, 0, 0).getTime();
}

function toTimeInputValue(ts) {
  const date = new Date(ts);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function startOfWeek(date) {
  const copy = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const offset = (copy.getDay() + 6) % 7;
  copy.setDate(copy.getDate() - offset);
  return copy;
}

function formatCurrency(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatCalendarRevenue(value) {
  if (value <= 0) return "-";
  if (value >= 1000) return `R$ ${(value / 1000).toFixed(1).replace(".", ",")}k`;
  return `R$ ${Math.round(value)}`;
}

function formatDateLong(dayKey) {
  const label = parseDayKey(dayKey).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function formatMonthLong(monthKey) {
  const [y, m] = monthKey.split("-").map(Number);
  const label = new Date(y, m - 1, 1).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function formatRateCurrency(value) {
  return value === null ? "Sem base" : formatCurrency(value);
}

function formatRateNumber(value) {
  return value === null ? "Sem base" : value.toFixed(2);
}

function formatPercent(value) {
  return value === null ? "Sem base" : `${(value * 100).toFixed(1)}%`;
}

function formatMinutes(value) {
  return `${value.toFixed(1)} min`;
}

function formatHours(value) {
  return `${value.toFixed(2)} h`;
}

function showAuthMessage(message, isError = false) {
  const el = document.getElementById("auth-message");
  el.textContent = message || "";
  el.style.color = isError ? "#b91c1c" : "#4f6255";
}

function setAuthMode(mode) {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const doctorTab = document.getElementById("auth-doctor-tab");
  const showRegister = mode === "register";
  loginForm.classList.toggle("hidden", showRegister);
  registerForm.classList.toggle("hidden", !showRegister);
  doctorTab.classList.add("active");
}

function showAuthScreen() {
  setAuthMode("login");
  showAuthMessage("");
  document.getElementById("auth-screen").classList.remove("hidden");
  document.getElementById("app-shell").classList.add("hidden");
}

function showAppScreen() {
  document.getElementById("auth-screen").classList.add("hidden");
  document.getElementById("app-shell").classList.remove("hidden");
}

function setSessionUser(user) {
  if (!user) {
    state.currentUserEmail = null;
    state.currentUserRole = null;
    state.adminSummaryCache = {};
    state.adminSummaryLoading = {};
    state.adminSummaryError = {};
    return;
  }

  state.currentUserEmail = user.email || null;
  state.currentUserRole = user.role === "admin" ? "admin" : "user";
}

function applyCurrentUserDataToState(data) {
  state.data = normalizeData(data || createEmptyData());
  state.selectedDateKey = toDayKey(new Date());
  state.calendarCursor = startOfMonth(new Date());
}

async function migrateLegacyDataIfNeeded() {
  if (!state.currentUserEmail) return;

  const markerKey = `${LEGACY_MIGRATION_PREFIX}${state.currentUserEmail}`;
  if (localStorage.getItem(markerKey) === "1") return;

  if (hasAnyDayRecord(state.data)) {
    localStorage.setItem(markerKey, "1");
    return;
  }

  const legacyData = getLegacyDataForUser(state.currentUserEmail);
  if (!legacyData || !hasAnyDayRecord(legacyData)) {
    localStorage.setItem(markerKey, "1");
    return;
  }

  state.data = legacyData;
  saveData();
  await flushSaveQueue();
  localStorage.setItem(markerKey, "1");
}

async function loginUser(email, password) {
  try {
    const payload = await apiRequest("/auth/login", {
      method: "POST",
      body: { email, password },
    });
    setSessionUser(payload.user);
    applyCurrentUserDataToState(payload.data);
    await migrateLegacyDataIfNeeded();
    showAuthMessage("");
    return { ok: true };
  } catch (err) {
    return { ok: false, message: err.message || "Falha ao fazer login." };
  }
}

async function registerUser(email, password) {
  try {
    const payload = await apiRequest("/auth/register", {
      method: "POST",
      body: { email, password },
    });
    return { ok: true, message: payload.message || "Cadastro criado. Faça login." };
  } catch (err) {
    return { ok: false, message: err.message || "Falha ao criar cadastro." };
  }
}

async function logoutUser() {
  await flushSaveQueue();
  await apiRequest("/auth/logout", { method: "POST" }).catch((err) => {
    console.error("Erro ao encerrar sessão:", err);
  });
  setSessionUser(null);
  state.data = createEmptyData();
  showAuthScreen();
}

function isAdminUser() {
  return state.currentUserRole === "admin";
}

function isToday(dayKey) {
  return dayKey === toDayKey(new Date());
}

function getTargetHours() {
  return Number(state.data.settings.targetHours) || 8;
}

function getMonthRevenue(monthKey) {
  let totalRevenue = 0;
  for (const [dayKey, records] of Object.entries(state.data.days)) {
    if (!dayKey.startsWith(`${monthKey}-`)) continue;
    for (const record of records) {
      totalRevenue += TYPE_META[record.type]?.price || 0;
    }
  }
  return totalRevenue;
}

function renderAdminRows(rows) {
  const tbody = document.getElementById("admin-users-body");
  tbody.innerHTML = "";

  if (!Array.isArray(rows) || rows.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="5">Nenhum usuário encontrado.</td>`;
    tbody.appendChild(tr);
    return;
  }

  for (const row of rows) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.email}</td>
      <td>${row.role === "admin" ? "Administrador" : "Usuário"}</td>
      <td>${row.consults || 0}</td>
      <td>${formatCurrency(Number(row.revenue || 0))}</td>
      <td>${row.activeDays || 0}</td>
    `;
    tbody.appendChild(tr);
  }
}

async function fetchAdminSummary(monthKey) {
  if (!isAdminUser()) return;
  if (state.adminSummaryLoading[monthKey]) return;
  state.adminSummaryLoading[monthKey] = true;
  delete state.adminSummaryError[monthKey];

  try {
    const payload = await apiRequest(`/admin/users?monthKey=${encodeURIComponent(monthKey)}`);
    state.adminSummaryCache[monthKey] = Array.isArray(payload.users) ? payload.users : [];
  } catch (err) {
    state.adminSummaryError[monthKey] = err.message || "Falha ao carregar painel admin.";
  } finally {
    delete state.adminSummaryLoading[monthKey];
    if (isAdminUser()) renderAdminPanel();
  }
}

function renderAdminPanel() {
  const panel = document.getElementById("admin-panel");
  if (!isAdminUser()) {
    panel.classList.add("hidden");
    return;
  }

  panel.classList.remove("hidden");
  const monthKey = monthKeyFromDayKey(state.selectedDateKey);
  document.getElementById(
    "admin-month-label"
  ).textContent = `Resumo dos usuários em ${formatMonthLong(monthKey)}`;

  if (state.adminSummaryCache[monthKey]) {
    renderAdminRows(state.adminSummaryCache[monthKey]);
    return;
  }

  const tbody = document.getElementById("admin-users-body");
  tbody.innerHTML = "";
  const tr = document.createElement("tr");
  const hasError = Boolean(state.adminSummaryError[monthKey]);
  tr.innerHTML = `<td colspan="5">${
    hasError ? state.adminSummaryError[monthKey] : "Carregando dados do administrador..."
  }</td>`;
  tbody.appendChild(tr);

  if (!hasError) {
    fetchAdminSummary(monthKey);
  } else {
    const retryTr = document.createElement("tr");
    retryTr.innerHTML = `<td colspan="5">Altere o mês ou atualize a página para tentar novamente.</td>`;
    tbody.appendChild(retryTr);
  }
}

function clearAdminSummaryCache() {
  state.adminSummaryCache = {};
  state.adminSummaryLoading = {};
  state.adminSummaryError = {};
}

function refreshAdminSummaryForCurrentMonth() {
  if (!isAdminUser()) return;
  const monthKey = monthKeyFromDayKey(state.selectedDateKey);
  delete state.adminSummaryCache[monthKey];
  state.saveQueue.finally(() => {
    if (!isAdminUser()) return;
    fetchAdminSummary(monthKey);
  });
}

function getMonthlyGoal(monthKey) {
  const monthlyGoals = state.data.settings.monthlyGoals || {};
  const value = Number(monthlyGoals[monthKey]);
  return Number.isFinite(value) && value >= 0 ? value : null;
}

function setMonthlyGoal(monthKey, value) {
  if (!state.data.settings.monthlyGoals || typeof state.data.settings.monthlyGoals !== "object") {
    state.data.settings.monthlyGoals = {};
  }
  if (value === null) {
    delete state.data.settings.monthlyGoals[monthKey];
    return;
  }
  state.data.settings.monthlyGoals[monthKey] = value;
}

function getPauseThresholdMinutes() {
  const value = Number(state.data.settings.pauseThresholdMin);
  return Number.isFinite(value) && value > 0 ? value : DEFAULT_PAUSE_THRESHOLD_MIN;
}

function getDayRecords(dayKey) {
  return state.data.days[dayKey] || [];
}

function addRecordAtDateTime(dayKey, time, type) {
  if (!TYPE_META[type]) return false;
  if (!dayKey || !time) return false;
  const ts = toTimestampFromDayAndTime(dayKey, time);
  if (!Number.isFinite(ts)) return false;
  if (!state.data.days[dayKey]) state.data.days[dayKey] = [];
  state.data.days[dayKey].push({ id: createId(), type, ts });
  state.data.days[dayKey].sort((a, b) => a.ts - b.ts);
  return true;
}

function findRecordLocationById(recordId) {
  for (const [dayKey, records] of Object.entries(state.data.days)) {
    const index = records.findIndex((record) => record.id === recordId);
    if (index !== -1) return { dayKey, index, record: records[index] };
  }
  return null;
}

function deleteRecordById(recordId) {
  const location = findRecordLocationById(recordId);
  if (!location) return false;

  const records = state.data.days[location.dayKey];
  records.splice(location.index, 1);
  if (!records.length) delete state.data.days[location.dayKey];
  return true;
}

function getRevenueFromCounts(counts) {
  return TYPE_KEYS.reduce((sum, type) => sum + (counts[type] || 0) * TYPE_META[type].price, 0);
}

function makeEmptyCounts() {
  return TYPE_KEYS.reduce((acc, type) => {
    acc[type] = 0;
    return acc;
  }, {});
}

function getIntervalsMinutes(records) {
  const intervals = [];
  for (let i = 1; i < records.length; i += 1) {
    intervals.push((records[i].ts - records[i - 1].ts) / 60000);
  }
  return intervals;
}

function percentile(sortedValues, p) {
  if (!sortedValues.length) return null;
  const position = (sortedValues.length - 1) * p;
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  if (lower === upper) return sortedValues[lower];
  const weight = position - lower;
  return sortedValues[lower] * (1 - weight) + sortedValues[upper] * weight;
}

function computeDayMetrics(dayKey) {
  const records = [...getDayRecords(dayKey)].sort((a, b) => a.ts - b.ts);
  const counts = makeEmptyCounts();

  for (const record of records) counts[record.type] += 1;

  const total = records.length;
  const revenue = getRevenueFromCounts(counts);
  const pauseThresholdMin = getPauseThresholdMinutes();
  const intervalsMinutes = getIntervalsMinutes(records);
  const totalClockHours =
    total > 1 ? (records[records.length - 1].ts - records[0].ts) / MS_HOUR : 0;

  const pauseIntervalsMinutes = intervalsMinutes.filter((gap) => gap > pauseThresholdMin);
  const pauseMinutes = pauseIntervalsMinutes.reduce((sum, gap) => sum + gap, 0);
  const activeHours = Math.max(totalClockHours - pauseMinutes / 60, 0);

  const hasAverageSample = total >= MIN_CONSULTS_FOR_AVERAGES;
  const grossRevenuePerHour =
    hasAverageSample && totalClockHours > 0 ? revenue / totalClockHours : null;
  const grossConsultationsPerHour =
    hasAverageSample && totalClockHours > 0 ? total / totalClockHours : null;
  const netRevenuePerHour = hasAverageSample && activeHours > 0 ? revenue / activeHours : null;
  const netConsultationsPerHour = hasAverageSample && activeHours > 0 ? total / activeHours : null;
  const utilization = hasAverageSample && totalClockHours > 0 ? activeHours / totalClockHours : null;

  const sortedIntervals = [...intervalsMinutes].sort((a, b) => a - b);
  const intervalStats = {
    p25: percentile(sortedIntervals, 0.25),
    median: percentile(sortedIntervals, 0.5),
    p75: percentile(sortedIntervals, 0.75),
    p90: percentile(sortedIntervals, 0.9),
  };

  let estimatedEndOfShift = null;
  let estimateSampleSize = 0;
  if (isToday(dayKey) && total > 0) {
    const sampleSize = Math.floor(total / 10) * 10;
    if (sampleSize >= 10) {
      const sampleRecords = records.slice(0, sampleSize);
      const sampleIntervalsMinutes = getIntervalsMinutes(sampleRecords);
      const samplePauseMinutes = sampleIntervalsMinutes
        .filter((gap) => gap > pauseThresholdMin)
        .reduce((sum, gap) => sum + gap, 0);
      const sampleRevenue = sampleRecords.reduce(
        (sum, record) => sum + TYPE_META[record.type].price,
        0
      );
      const sampleClockHours =
        sampleRecords.length > 1
          ? (sampleRecords[sampleRecords.length - 1].ts - sampleRecords[0].ts) / MS_HOUR
          : 0;
      const sampleActiveHours = Math.max(sampleClockHours - samplePauseMinutes / 60, 0);
      if (sampleActiveHours > 0) {
        const averageNow = sampleRevenue / sampleActiveHours;
        estimatedEndOfShift = averageNow * getTargetHours();
        estimateSampleSize = sampleSize;
      }
    }
  }

  return {
    records,
    counts,
    total,
    revenue,
    pauseThresholdMin,
    totalClockHours,
    activeHours,
    grossRevenuePerHour,
    grossConsultationsPerHour,
    netRevenuePerHour,
    netConsultationsPerHour,
    utilization,
    intervalStats,
    pauseCount: pauseIntervalsMinutes.length,
    pauseMinutes,
    longestPauseMinutes: pauseIntervalsMinutes.length ? Math.max(...pauseIntervalsMinutes) : 0,
    hasAverageSample,
    estimatedEndOfShift,
    estimateSampleSize,
  };
}

function computeMonthMetrics(monthKey) {
  const counts = makeEmptyCounts();
  const pauseThresholdMin = getPauseThresholdMinutes();
  let total = 0;
  let totalClockHours = 0;
  let activeHours = 0;

  for (const [dayKey, dayRecords] of Object.entries(state.data.days)) {
    if (!dayKey.startsWith(`${monthKey}-`)) continue;
    if (!Array.isArray(dayRecords) || dayRecords.length === 0) continue;

    const records = [...dayRecords].sort((a, b) => a.ts - b.ts);
    for (const record of records) {
      counts[record.type] += 1;
    }
    total += records.length;

    if (records.length < 2) continue;

    const dayClockHours = (records[records.length - 1].ts - records[0].ts) / MS_HOUR;
    totalClockHours += dayClockHours;

    const dayPauseMinutes = getIntervalsMinutes(records)
      .filter((gap) => gap > pauseThresholdMin)
      .reduce((sum, gap) => sum + gap, 0);
    activeHours += Math.max(dayClockHours - dayPauseMinutes / 60, 0);
  }

  const revenue = getRevenueFromCounts(counts);
  const hasAverageSample = total >= MIN_CONSULTS_FOR_AVERAGES;

  return {
    counts,
    total,
    revenue,
    grossRevenuePerHour: hasAverageSample && totalClockHours > 0 ? revenue / totalClockHours : null,
    netRevenuePerHour: hasAverageSample && activeHours > 0 ? revenue / activeHours : null,
    grossConsultationsPerHour: hasAverageSample && totalClockHours > 0 ? total / totalClockHours : null,
    netConsultationsPerHour: hasAverageSample && activeHours > 0 ? total / activeHours : null,
  };
}

function importRowsIntoDay(dayKey, rows) {
  if (!state.data.days[dayKey]) state.data.days[dayKey] = [];

  const existingSignatures = new Set(
    state.data.days[dayKey].map((record) => `${record.type}|${record.ts}`)
  );

  for (const row of rows) {
    const ts = toTimestampFromDayAndTime(dayKey, row.time);
    const signature = `${row.type}|${ts}`;
    if (existingSignatures.has(signature)) continue;

    state.data.days[dayKey].push({
      id: createId(),
      type: row.type,
      ts,
    });
    existingSignatures.add(signature);
  }

  state.data.days[dayKey].sort((a, b) => a.ts - b.ts);
}

function toTimeFromTotalMinutes(totalMinutes) {
  const hours = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
  const minutes = String(totalMinutes % 60).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function buildTypeSequence(adultoCount, plantaoCount) {
  const total = adultoCount + plantaoCount;
  if (total <= 0) return [];

  let adultoRemaining = adultoCount;
  let plantaoRemaining = plantaoCount;
  const sequence = [];
  const seedBase = adultoCount * 11 + plantaoCount * 17 + total * 3;

  for (let i = 0; i < total; i += 1) {
    const remaining = total - i;
    const adultChance = adultoRemaining / remaining;
    const draw = ((seedBase + i * 37) % 100) / 100;

    if (adultoRemaining > 0 && (plantaoRemaining === 0 || draw < adultChance)) {
      sequence.push("adulto");
      adultoRemaining -= 1;
      continue;
    }

    if (plantaoRemaining > 0) {
      sequence.push("plantao");
      plantaoRemaining -= 1;
    }
  }

  return sequence;
}

function buildIntervalsWithinWorkday(totalRecords, seedBase) {
  const gaps = Math.max(totalRecords - 1, 0);
  if (gaps === 0) return [];

  const minGap = 5;
  const maxGap = 10;
  const startMinutes = 8 * 60;
  const endMinutes = 17 * 60;
  let currentMinutes = startMinutes;
  const intervals = [];

  for (let i = 0; i < gaps; i += 1) {
    const gapsAfterCurrent = gaps - i - 1;
    const remainingCapacity = endMinutes - currentMinutes;
    const maxAllowed = Math.min(maxGap, remainingCapacity - minGap * gapsAfterCurrent);
    const minAllowed = minGap;
    if (maxAllowed < minAllowed) {
      intervals.push(minGap);
      currentMinutes += minGap;
      continue;
    }
    const spread = Math.max(maxAllowed - minAllowed, 0);
    const chosen =
      spread === 0 ? minAllowed : minAllowed + ((seedBase + i * 19 + i * i) % (spread + 1));

    intervals.push(chosen);
    currentMinutes += chosen;
  }

  return intervals;
}

function buildRowsForDailyCounts(dayKey, adultoCount, plantaoCount) {
  const total = adultoCount + plantaoCount;
  if (total <= 0) return [];

  const typeSequence = buildTypeSequence(adultoCount, plantaoCount);
  const seedBase = Number(dayKey.replaceAll("-", "")) || total;
  const intervals = buildIntervalsWithinWorkday(total, seedBase);
  const rows = [];

  let currentMinutes = 8 * 60;
  rows.push({ time: toTimeFromTotalMinutes(currentMinutes), type: typeSequence[0] });

  for (let i = 1; i < total; i += 1) {
    currentMinutes += intervals[i - 1];
    if (currentMinutes > 17 * 60) currentMinutes = 17 * 60;
    rows.push({ time: toTimeFromTotalMinutes(currentMinutes), type: typeSequence[i] });
  }

  return rows;
}

function applyAdminNumbersImport() {
  const completedImports = Array.isArray(state.data.settings.completedImports)
    ? state.data.settings.completedImports
    : [];

  if (completedImports.includes(ADMIN_NUMBERS_IMPORT_ID)) return;

  for (const day of ADMIN_NUMBERS_DAILY_COUNTS) {
    const rows = buildRowsForDailyCounts(day.dayKey, day.adulto, day.plantao);
    state.data.days[day.dayKey] = rows
      .map((row) => ({
        id: createId(),
        type: row.type,
        ts: toTimestampFromDayAndTime(day.dayKey, row.time),
      }))
      .sort((a, b) => a.ts - b.ts);
  }

  state.data.settings.completedImports = [...completedImports, ADMIN_NUMBERS_IMPORT_ID];

  const todayKey = toDayKey(new Date());
  const defaultSelectedDay = ADMIN_NUMBERS_DAILY_COUNTS[0]?.dayKey || todayKey;
  state.selectedDateKey = state.data.days[todayKey] ? todayKey : defaultSelectedDay;
  state.calendarCursor = startOfMonth(parseDayKey(state.selectedDateKey));
  saveData();
  refreshAdminSummaryForCurrentMonth();
}

function applyPresetImportForYesterday() {
  const completedImports = Array.isArray(state.data.settings.completedImports)
    ? state.data.settings.completedImports
    : [];

  if (completedImports.includes(PRESET_IMPORT_ID)) return;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const dayKey = toDayKey(yesterday);
  importRowsIntoDay(dayKey, YESTERDAY_IMPORT_ROWS);
  state.data.settings.completedImports = [...completedImports, PRESET_IMPORT_ID];
  state.selectedDateKey = dayKey;
  state.calendarCursor = startOfMonth(parseDayKey(dayKey));
  saveData();
  refreshAdminSummaryForCurrentMonth();
}

function applyPresetImportForToday() {
  const completedImports = Array.isArray(state.data.settings.completedImports)
    ? state.data.settings.completedImports
    : [];

  if (completedImports.includes(TODAY_PRESET_IMPORT_ID)) return;

  const dayKey = toDayKey(new Date());
  importRowsIntoDay(dayKey, TODAY_IMPORT_ROWS);
  state.data.settings.completedImports = [...completedImports, TODAY_PRESET_IMPORT_ID];
  state.selectedDateKey = dayKey;
  state.calendarCursor = startOfMonth(parseDayKey(dayKey));
  saveData();
  refreshAdminSummaryForCurrentMonth();
}

function applyForceTodayRecordsToPlantao() {
  const completedImports = Array.isArray(state.data.settings.completedImports)
    ? state.data.settings.completedImports
    : [];

  if (completedImports.includes(TODAY_FORCE_PLANTAO_ID)) return;

  const dayKey = toDayKey(new Date());
  const records = state.data.days[dayKey] || [];
  if (records.length > 0) {
    for (const record of records) record.type = "plantao";
  }

  state.data.settings.completedImports = [...completedImports, TODAY_FORCE_PLANTAO_ID];
  state.selectedDateKey = dayKey;
  state.calendarCursor = startOfMonth(parseDayKey(dayKey));
  saveData();
  refreshAdminSummaryForCurrentMonth();
}

function applyAdminTodayFileImport() {
  const completedImports = Array.isArray(state.data.settings.completedImports)
    ? state.data.settings.completedImports
    : [];

  if (completedImports.includes(ADMIN_TODAY_FILE_IMPORT_ID)) return;

  const dayKey = toDayKey(new Date());
  state.data.days[dayKey] = TODAY_IMPORT_ROWS.map((row) => ({
    id: createId(),
    type: row.type,
    ts: toTimestampFromDayAndTime(dayKey, row.time),
  })).sort((a, b) => a.ts - b.ts);

  state.data.settings.completedImports = [...completedImports, ADMIN_TODAY_FILE_IMPORT_ID];
  state.selectedDateKey = dayKey;
  state.calendarCursor = startOfMonth(parseDayKey(dayKey));
  saveData();
  refreshAdminSummaryForCurrentMonth();
}

function registerConsult(type) {
  const now = Date.now();
  const dayKey = toDayKey(new Date(now));
  if (!state.data.days[dayKey]) state.data.days[dayKey] = [];
  state.data.days[dayKey].push({ id: createId(), type, ts: now });
  state.data.days[dayKey].sort((a, b) => a.ts - b.ts);

  state.selectedDateKey = dayKey;
  state.calendarCursor = startOfMonth(parseDayKey(dayKey));
  saveData();
  refreshAdminSummaryForCurrentMonth();
  renderAll();
}

function undoLastConsultFromSelectedDay() {
  const records = getDayRecords(state.selectedDateKey);
  if (!records.length) return;

  let latestIndex = 0;
  for (let i = 1; i < records.length; i += 1) {
    if (records[i].ts > records[latestIndex].ts) latestIndex = i;
  }

  records.splice(latestIndex, 1);
  if (!records.length) delete state.data.days[state.selectedDateKey];
  saveData();
  refreshAdminSummaryForCurrentMonth();
  renderAll();
}

function renderMetrics(dayMetrics) {
  document.getElementById("selected-date-label").textContent = formatDateLong(state.selectedDateKey);
  document.getElementById("total-count").textContent = String(dayMetrics.total);
  document.getElementById("total-revenue").textContent = formatCurrency(dayMetrics.revenue);
  document.getElementById("gross-revenue-per-hour").textContent = formatRateCurrency(
    dayMetrics.grossRevenuePerHour
  );
  document.getElementById("gross-consults-per-hour").textContent = formatRateNumber(
    dayMetrics.grossConsultationsPerHour
  );
  document.getElementById("net-revenue-per-hour").textContent = formatRateCurrency(
    dayMetrics.netRevenuePerHour
  );
  document.getElementById("net-consults-per-hour").textContent = formatRateNumber(
    dayMetrics.netConsultationsPerHour
  );
  document.getElementById("utilization-rate").textContent = formatPercent(dayMetrics.utilization);
  document.getElementById("clock-time-hours").textContent = formatHours(dayMetrics.totalClockHours);
  document.getElementById("active-time-hours").textContent = formatHours(dayMetrics.activeHours);

  const estimationEl = document.getElementById("estimated-revenue");
  if (dayMetrics.estimatedEndOfShift !== null) {
    estimationEl.textContent = `${formatCurrency(dayMetrics.estimatedEndOfShift)} (base ${
      dayMetrics.estimateSampleSize
    } at.)`;
  } else if (isToday(state.selectedDateKey)) {
    estimationEl.textContent = dayMetrics.total > 0 ? "Disponível a cada 10 atend." : "Sem base";
  } else {
    estimationEl.textContent = "Dia encerrado";
  }

  document.getElementById(
    "type-breakdown"
  ).textContent = TYPE_KEYS.map(
    (type) => `${TYPE_META[type].label}: ${dayMetrics.counts[type]}`
  ).join(" | ");
}

function renderMonthGoalMetrics() {
  const monthKey = monthKeyFromDayKey(state.selectedDateKey);
  const monthLabel = formatMonthLong(monthKey);
  const goal = getMonthlyGoal(monthKey);
  const monthRevenue = getMonthRevenue(monthKey);
  const monthMetrics = computeMonthMetrics(monthKey);

  document.getElementById("month-goal-title").textContent = `Meta do mês (${monthLabel})`;
  document.getElementById("monthly-target-label").textContent = `Meta de ${monthLabel} (R$)`;
  document.getElementById("month-goal-achieved").textContent = `Acumulado: ${formatCurrency(
    monthRevenue
  )}`;

  const goalValueEl = document.getElementById("month-goal-value");
  const remainingEl = document.getElementById("month-goal-remaining");
  const progressEl = document.getElementById("month-goal-progress");
  document.getElementById(
    "month-type-breakdown"
  ).textContent = TYPE_KEYS.map(
    (type) => `${TYPE_META[type].label}: ${monthMetrics.counts[type]}`
  ).join(" | ");
  document.getElementById("month-total-consults").textContent = `Total do mês: ${monthMetrics.total}`;
  document.getElementById("month-gross-revenue-per-hour").textContent = formatRateCurrency(
    monthMetrics.grossRevenuePerHour
  );
  document.getElementById("month-net-revenue-per-hour").textContent = formatRateCurrency(
    monthMetrics.netRevenuePerHour
  );
  document.getElementById("month-gross-consults-per-hour").textContent = formatRateNumber(
    monthMetrics.grossConsultationsPerHour
  );
  document.getElementById("month-net-consults-per-hour").textContent = formatRateNumber(
    monthMetrics.netConsultationsPerHour
  );

  if (goal === null) {
    goalValueEl.textContent = "Não definida";
    remainingEl.textContent = "Defina uma meta";
    progressEl.textContent = "A meta mensal vai diminuindo conforme o faturamento dos dias.";
    return;
  }

  goalValueEl.textContent = formatCurrency(goal);
  const remaining = goal - monthRevenue;
  if (remaining > 0) {
    remainingEl.textContent = formatCurrency(remaining);
  } else {
    remainingEl.textContent = `Meta batida (+${formatCurrency(Math.abs(remaining))})`;
  }

  const progress = goal > 0 ? (monthRevenue / goal) * 100 : monthRevenue > 0 ? 100 : 0;
  progressEl.textContent = `Progresso: ${progress.toFixed(1)}%`;
}

function renderIntervalAndPauseStats(dayMetrics) {
  const intervalList = document.getElementById("interval-stats");
  const pauseList = document.getElementById("pause-stats");
  intervalList.innerHTML = "";
  pauseList.innerHTML = "";

  if (dayMetrics.total < 2) {
    intervalList.innerHTML = "<li>É preciso ao menos 2 atendimentos para calcular intervalos.</li>";
    pauseList.innerHTML = "<li>Sem pausas detectadas.</li>";
    return;
  }

  intervalList.innerHTML = `
    <li>Mediana: ${formatMinutes(dayMetrics.intervalStats.median ?? 0)}</li>
    <li>P25-P75: ${formatMinutes(dayMetrics.intervalStats.p25 ?? 0)} - ${formatMinutes(
      dayMetrics.intervalStats.p75 ?? 0
    )}</li>
    <li>P90: ${formatMinutes(dayMetrics.intervalStats.p90 ?? 0)}</li>
    <li>Mediana = intervalo típico entre um atendimento e o próximo.</li>
    <li>P25-P75 = faixa onde estão 50% dos intervalos entre atendimentos.</li>
  `;

  if (dayMetrics.pauseCount === 0) {
    pauseList.innerHTML = `<li>Sem pausas acima de ${dayMetrics.pauseThresholdMin} min.</li>`;
    return;
  }

  pauseList.innerHTML = `
    <li>Pausas acima de ${dayMetrics.pauseThresholdMin} min: ${dayMetrics.pauseCount}</li>
    <li>Duração total de pausas: ${formatMinutes(dayMetrics.pauseMinutes)}</li>
    <li>Maior pausa: ${formatMinutes(dayMetrics.longestPauseMinutes)}</li>
  `;
}

function openEditRecordModal(recordId) {
  const location = findRecordLocationById(recordId);
  if (!location) return;

  state.editingRecordId = recordId;
  document.getElementById("edit-record-date").value = toDayKey(new Date(location.record.ts));
  document.getElementById("edit-record-time").value = toTimeInputValue(location.record.ts);
  document.getElementById("edit-record-type").value = location.record.type;

  const overlay = document.getElementById("edit-record-modal");
  overlay.classList.remove("hidden");
  overlay.setAttribute("aria-hidden", "false");
}

function closeEditRecordModal() {
  state.editingRecordId = null;
  const overlay = document.getElementById("edit-record-modal");
  overlay.classList.add("hidden");
  overlay.setAttribute("aria-hidden", "true");
}

function saveEditedRecordFromModal() {
  if (!state.editingRecordId) return;
  const location = findRecordLocationById(state.editingRecordId);
  if (!location) {
    closeEditRecordModal();
    return;
  }

  const newDayKey = document.getElementById("edit-record-date").value;
  const newTime = document.getElementById("edit-record-time").value;
  const newType = document.getElementById("edit-record-type").value;
  if (!newDayKey || !newTime || !TYPE_META[newType]) return;

  const newTs = toTimestampFromDayAndTime(newDayKey, newTime);
  if (!Number.isFinite(newTs)) return;

  const previousRecord = location.record;
  deleteRecordById(previousRecord.id);

  if (!state.data.days[newDayKey]) state.data.days[newDayKey] = [];
  state.data.days[newDayKey].push({ id: previousRecord.id, type: newType, ts: newTs });
  state.data.days[newDayKey].sort((a, b) => a.ts - b.ts);

  state.selectedDateKey = newDayKey;
  state.calendarCursor = startOfMonth(parseDayKey(newDayKey));
  saveData();
  refreshAdminSummaryForCurrentMonth();
  renderAll();
  closeEditRecordModal();
}

function renderDayList(records) {
  const list = document.getElementById("day-list");
  list.innerHTML = "";

  if (!records.length) {
    const item = document.createElement("li");
    item.textContent = "Nenhum atendimento registrado neste dia.";
    list.appendChild(item);
    return;
  }

  const ordered = [...records].sort((a, b) => b.ts - a.ts);
  for (const record of ordered) {
    const item = document.createElement("li");
    const row = document.createElement("div");
    row.className = "day-row";

    const main = document.createElement("div");
    main.className = "day-main";
    main.innerHTML = `
      <span>${formatTime(record.ts)}</span>
      <span class="tag ${record.type}">${TYPE_META[record.type].label}</span>
    `;

    const actions = document.createElement("div");
    actions.className = "day-actions";

    const editBtn = document.createElement("button");
    editBtn.className = "ghost day-action-btn";
    editBtn.type = "button";
    editBtn.textContent = "Editar";
    editBtn.addEventListener("click", () => openEditRecordModal(record.id));

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "ghost day-action-btn";
    deleteBtn.type = "button";
    deleteBtn.textContent = "Excluir";
    deleteBtn.addEventListener("click", () => {
      if (!deleteRecordById(record.id)) return;
      saveData();
      refreshAdminSummaryForCurrentMonth();
      renderAll();
    });

    actions.append(editBtn, deleteBtn);
    row.append(main, actions);
    item.appendChild(row);
    list.appendChild(item);
  }
}

function getWeekSeries(anchorDayKey) {
  const start = startOfWeek(parseDayKey(anchorDayKey));
  const labels = [];
  const totals = [];
  const revenues = [];

  for (let i = 0; i < 7; i += 1) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    const key = toDayKey(date);
    const metrics = computeDayMetrics(key);

    labels.push(
      date.toLocaleDateString("pt-BR", {
        weekday: "short",
        day: "2-digit",
      })
    );
    totals.push(metrics.total);
    revenues.push(metrics.revenue);
  }

  return { labels, totals, revenues };
}

function getMonthSeries(anchorDayKey) {
  const date = parseDayKey(anchorDayKey);
  const y = date.getFullYear();
  const m = date.getMonth();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const labels = [];
  const totals = [];
  const revenues = [];

  for (let day = 1; day <= daysInMonth; day += 1) {
    const current = new Date(y, m, day);
    const key = toDayKey(current);
    const metrics = computeDayMetrics(key);
    labels.push(String(day));
    totals.push(metrics.total);
    revenues.push(metrics.revenue);
  }
  return { labels, totals, revenues };
}

function getHourlyEvolutionSeries(dayKey) {
  const records = [...getDayRecords(dayKey)].sort((a, b) => a.ts - b.ts);
  if (!records.length) {
    return {
      labels: [],
      grossRevenuePerHour: [],
      grossConsultationsPerHour: [],
      netRevenuePerHour: [],
      netConsultationsPerHour: [],
    };
  }

  const firstTs = records[0].ts;
  const pauseThresholdMin = getPauseThresholdMinutes();
  let cumulativeRevenue = 0;
  let pauseMinutesAcc = 0;
  const labels = [];
  const grossRevenuePerHour = [];
  const grossConsultationsPerHour = [];
  const netRevenuePerHour = [];
  const netConsultationsPerHour = [];

  for (let index = 0; index < records.length; index += 1) {
    const record = records[index];
    cumulativeRevenue += TYPE_META[record.type].price;
    if (index > 0) {
      const intervalMin = (records[index].ts - records[index - 1].ts) / 60000;
      if (intervalMin > pauseThresholdMin) pauseMinutesAcc += intervalMin;
    }
    const clockHours = index > 0 ? (record.ts - firstTs) / MS_HOUR : 0;
    const activeHours = Math.max(clockHours - pauseMinutesAcc / 60, 0);
    const enoughSample = index + 1 >= MIN_CONSULTS_FOR_AVERAGES;

    labels.push(formatTime(record.ts));
    grossRevenuePerHour.push(
      enoughSample && clockHours > 0 ? Number((cumulativeRevenue / clockHours).toFixed(2)) : null
    );
    grossConsultationsPerHour.push(
      enoughSample && clockHours > 0 ? Number(((index + 1) / clockHours).toFixed(2)) : null
    );
    netRevenuePerHour.push(
      enoughSample && activeHours > 0 ? Number((cumulativeRevenue / activeHours).toFixed(2)) : null
    );
    netConsultationsPerHour.push(
      enoughSample && activeHours > 0 ? Number(((index + 1) / activeHours).toFixed(2)) : null
    );
  }

  return {
    labels,
    grossRevenuePerHour,
    grossConsultationsPerHour,
    netRevenuePerHour,
    netConsultationsPerHour,
  };
}

function destroyChartIfExists(chartKey) {
  if (state.charts[chartKey]) {
    state.charts[chartKey].destroy();
    state.charts[chartKey] = null;
  }
}

function renderHourlyModalChart() {
  if (!state.hourlyModal.isOpen) return;

  const overlay = document.getElementById("hourly-modal");
  const titleEl = document.getElementById("hourly-modal-title");
  const subtitleEl = document.getElementById("hourly-modal-subtitle");
  const focusMetric = state.hourlyModal.focusMetric;
  const series = getHourlyEvolutionSeries(state.selectedDateKey);
  const metricMap = {
    grossRevenuePerHour: {
      title: "Evolução de R$/hora bruta",
      seriesKey: "grossRevenuePerHour",
      lineColor: "#14532d",
      yAxisTitle: "R$ por hora (bruta)",
    },
    grossConsultationsPerHour: {
      title: "Evolução de Atendimentos/hora bruta",
      seriesKey: "grossConsultationsPerHour",
      lineColor: "#ea580c",
      yAxisTitle: "Atendimentos por hora (bruta)",
    },
    netRevenuePerHour: {
      title: "Evolução de R$/hora líquida",
      seriesKey: "netRevenuePerHour",
      lineColor: "#0f766e",
      yAxisTitle: "R$ por hora (líquida)",
    },
    netConsultationsPerHour: {
      title: "Evolução de Atendimentos/hora líquida",
      seriesKey: "netConsultationsPerHour",
      lineColor: "#1d4ed8",
      yAxisTitle: "Atendimentos por hora (líquida)",
    },
  };
  const metricConfig = metricMap[focusMetric] || metricMap.netRevenuePerHour;

  overlay.classList.remove("hidden");
  overlay.setAttribute("aria-hidden", "false");
  titleEl.textContent = metricConfig.title;
  subtitleEl.textContent = `${formatDateLong(
    state.selectedDateKey
  )} • Variação por atendimento (${getPauseThresholdMinutes()} min como pausa)`;

  destroyChartIfExists("hourly");
  if (!series.labels.length) {
    subtitleEl.textContent = `${formatDateLong(
      state.selectedDateKey
    )} • Registre atendimentos para visualizar este gráfico`;
    return;
  }

  const selectedSeries = series[metricConfig.seriesKey] || [];
  const hasValidPoint = selectedSeries.some((value) => value !== null);
  if (!hasValidPoint) {
    subtitleEl.textContent = `${formatDateLong(
      state.selectedDateKey
    )} • Disponível a partir do ${MIN_CONSULTS_FOR_AVERAGES}º atendimento`;
    return;
  }

  const ctx = document.getElementById("hourly-evolution-chart");
  state.charts.hourly = new Chart(ctx, {
    type: "line",
    data: {
      labels: series.labels,
      datasets: [
        {
          label: metricConfig.title.replace("Evolução de ", ""),
          data: selectedSeries,
          yAxisID: "yMetric",
          borderColor: metricConfig.lineColor,
          backgroundColor: metricConfig.lineColor,
          borderWidth: 3,
          tension: 0.25,
          pointRadius: 3,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          position: "bottom",
        },
      },
      scales: {
        yMetric: {
          beginAtZero: true,
          type: "linear",
          position: "left",
          title: { display: true, text: metricConfig.yAxisTitle },
        },
      },
    },
  });
}

function openHourlyModal(focusMetric) {
  state.hourlyModal.isOpen = true;
  state.hourlyModal.focusMetric = focusMetric;
  renderHourlyModalChart();
}

function closeHourlyModal() {
  state.hourlyModal.isOpen = false;
  const overlay = document.getElementById("hourly-modal");
  overlay.classList.add("hidden");
  overlay.setAttribute("aria-hidden", "true");
  destroyChartIfExists("hourly");
}

function renderCharts(dayMetrics) {
  const dayCtx = document.getElementById("day-chart");
  const weekCtx = document.getElementById("week-chart");
  const monthCtx = document.getElementById("month-chart");

  destroyChartIfExists("day");
  destroyChartIfExists("week");
  destroyChartIfExists("month");

  state.charts.day = new Chart(dayCtx, {
    type: "doughnut",
    data: {
      labels: TYPE_KEYS.map((type) => TYPE_META[type].label),
      datasets: [
        {
          data: TYPE_KEYS.map((type) => dayMetrics.counts[type]),
          backgroundColor: TYPE_KEYS.map((type) => TYPE_META[type].color),
        },
      ],
    },
    options: {
      plugins: { legend: { position: "bottom" } },
    },
  });

  const week = getWeekSeries(state.selectedDateKey);
  state.charts.week = new Chart(weekCtx, {
    data: {
      labels: week.labels,
      datasets: [
        {
          type: "bar",
          label: "Faturamento",
          data: week.revenues,
          backgroundColor: "#14532d99",
          yAxisID: "y",
        },
        {
          type: "line",
          label: "Atendimentos",
          data: week.totals,
          borderColor: "#ea580c",
          backgroundColor: "#ea580c",
          tension: 0.25,
          yAxisID: "y1",
        },
      ],
    },
    options: {
      plugins: { legend: { position: "bottom" } },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: "R$" },
        },
        y1: {
          beginAtZero: true,
          position: "right",
          grid: { drawOnChartArea: false },
          title: { display: true, text: "Qtd" },
        },
      },
    },
  });

  const month = getMonthSeries(state.selectedDateKey);
  state.charts.month = new Chart(monthCtx, {
    data: {
      labels: month.labels,
      datasets: [
        {
          type: "bar",
          label: "Atendimentos",
          data: month.totals,
          backgroundColor: "#0f766e99",
          yAxisID: "y",
        },
        {
          type: "line",
          label: "Faturamento",
          data: month.revenues,
          borderColor: "#14532d",
          backgroundColor: "#14532d",
          tension: 0.22,
          yAxisID: "y1",
        },
      ],
    },
    options: {
      plugins: { legend: { position: "bottom" } },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: "Qtd" },
        },
        y1: {
          beginAtZero: true,
          position: "right",
          grid: { drawOnChartArea: false },
          title: { display: true, text: "R$" },
        },
      },
    },
  });
}

function getHeatClass(revenue, maxRevenue) {
  if (revenue <= 0 || maxRevenue <= 0) return "";
  const ratio = revenue / maxRevenue;
  if (ratio > 0.75) return "heat-4";
  if (ratio > 0.5) return "heat-3";
  if (ratio > 0.25) return "heat-2";
  return "heat-1";
}

function renderCalendar() {
  const grid = document.getElementById("calendar-grid");
  grid.innerHTML = "";

  const cursor = state.calendarCursor;
  const y = cursor.getFullYear();
  const m = cursor.getMonth();
  const first = new Date(y, m, 1);
  const startOffset = (first.getDay() + 6) % 7;
  const start = new Date(y, m, 1 - startOffset);
  const title = first.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

  document.getElementById("calendar-title").textContent =
    title.charAt(0).toUpperCase() + title.slice(1);

  const monthRevenues = [];
  const monthDays = new Date(y, m + 1, 0).getDate();
  for (let d = 1; d <= monthDays; d += 1) {
    const key = toDayKey(new Date(y, m, d));
    monthRevenues.push(computeDayMetrics(key).revenue);
  }
  const maxRevenue = Math.max(...monthRevenues, 0);

  for (let i = 0; i < 42; i += 1) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    const key = toDayKey(date);
    const metrics = computeDayMetrics(key);

    const btn = document.createElement("button");
    btn.className = "day-cell";
    if (date.getMonth() !== m) btn.classList.add("other-month");
    if (key === state.selectedDateKey) btn.classList.add("selected");
    if (key === toDayKey(new Date())) btn.classList.add("today");
    const heatClass = getHeatClass(metrics.revenue, maxRevenue);
    if (heatClass) btn.classList.add(heatClass);

    btn.innerHTML = `
      <span class="num">${date.getDate()}</span>
      <span class="mini">${metrics.total} at.</span>
      <span class="mini">${formatCalendarRevenue(metrics.revenue)}</span>
    `;

    btn.addEventListener("click", () => {
      state.selectedDateKey = key;
      state.calendarCursor = startOfMonth(date);
      renderAll();
    });
    grid.appendChild(btn);
  }
}

function renderAll() {
  if (!state.currentUserEmail) return;

  document.getElementById("session-user-label").textContent = `Logado como: ${
    state.currentUserEmail
  }${isAdminUser() ? " (admin)" : ""}`;
  const metrics = computeDayMetrics(state.selectedDateKey);
  renderMetrics(metrics);
  renderMonthGoalMetrics();
  renderAdminPanel();
  renderIntervalAndPauseStats(metrics);
  renderDayList(metrics.records);
  renderCalendar();
  renderCharts(metrics);
  renderHourlyModalChart();
  document.getElementById("target-hours").value = getTargetHours();
  document.getElementById("pause-threshold").value = getPauseThresholdMinutes();
  const monthKey = monthKeyFromDayKey(state.selectedDateKey);
  const monthGoal = getMonthlyGoal(monthKey);
  document.getElementById("monthly-target").value = monthGoal === null ? "" : String(monthGoal);
  document.getElementById("manual-date").value = state.selectedDateKey;
  const manualTimeInput = document.getElementById("manual-time");
  if (!manualTimeInput.value) manualTimeInput.value = toTimeInputValue(Date.now());
}

function completeLoginFlow() {
  clearAdminSummaryCache();
  if (isAdminUser()) {
    applyPresetImportForYesterday();
    applyPresetImportForToday();
    applyForceTodayRecordsToPlantao();
    applyAdminNumbersImport();
    applyAdminTodayFileImport();
  }
  showAppScreen();
  renderAll();
}

async function tryRestoreSession() {
  try {
    const payload = await apiRequest("/auth/session");
    setSessionUser(payload.user);
    applyCurrentUserDataToState(payload.data);
    await migrateLegacyDataIfNeeded();
    completeLoginFlow();
    return true;
  } catch (err) {
    return false;
  }
}

function bindEvents() {
  document.getElementById("auth-doctor-tab").addEventListener("click", () => {
    setAuthMode("login");
    showAuthMessage("");
  });

  document.getElementById("show-register-btn").addEventListener("click", () => {
    setAuthMode("register");
    showAuthMessage("");
  });

  document.getElementById("show-login-btn").addEventListener("click", () => {
    setAuthMode("login");
    showAuthMessage("");
  });

  document.getElementById("login-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    const result = await loginUser(email, password);
    if (!result.ok) {
      showAuthMessage(result.message, true);
      return;
    }
    completeLoginFlow();
  });

  document.getElementById("register-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
    const result = await registerUser(email, password);
    showAuthMessage(result.message, !result.ok);
    if (result.ok) {
      document.getElementById("login-email").value = String(email || "").trim().toLowerCase();
      setAuthMode("login");
    }
  });

  document.getElementById("logout-btn").addEventListener("click", async () => {
    await logoutUser();
  });

  document.querySelectorAll(".type-btn").forEach((button) => {
    button.addEventListener("click", () => registerConsult(button.dataset.type));
  });

  document.getElementById("undo-btn").addEventListener("click", undoLastConsultFromSelectedDay);

  document.getElementById("prev-month").addEventListener("click", () => {
    state.calendarCursor = new Date(
      state.calendarCursor.getFullYear(),
      state.calendarCursor.getMonth() - 1,
      1
    );
    renderCalendar();
  });

  document.getElementById("next-month").addEventListener("click", () => {
    state.calendarCursor = new Date(
      state.calendarCursor.getFullYear(),
      state.calendarCursor.getMonth() + 1,
      1
    );
    renderCalendar();
  });

  document.getElementById("target-hours").addEventListener("change", (event) => {
    const value = Number(event.target.value);
    if (!Number.isFinite(value) || value <= 0) {
      event.target.value = getTargetHours();
      return;
    }
    state.data.settings.targetHours = value;
    saveData();
    refreshAdminSummaryForCurrentMonth();
    renderAll();
  });

  document.getElementById("pause-threshold").addEventListener("change", (event) => {
    const value = Number(event.target.value);
    if (!Number.isFinite(value) || value <= 0) {
      event.target.value = getPauseThresholdMinutes();
      return;
    }
    state.data.settings.pauseThresholdMin = value;
    saveData();
    refreshAdminSummaryForCurrentMonth();
    renderAll();
  });

  document.getElementById("monthly-target").addEventListener("change", (event) => {
    const raw = String(event.target.value).trim();
    const monthKey = monthKeyFromDayKey(state.selectedDateKey);

    if (raw === "") {
      setMonthlyGoal(monthKey, null);
      saveData();
      refreshAdminSummaryForCurrentMonth();
      renderAll();
      return;
    }

    const value = Number(raw);
    if (!Number.isFinite(value) || value < 0) {
      const previous = getMonthlyGoal(monthKey);
      event.target.value = previous === null ? "" : String(previous);
      return;
    }

    setMonthlyGoal(monthKey, value);
    saveData();
    refreshAdminSummaryForCurrentMonth();
    renderAll();
  });

  document.getElementById("manual-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const dayKey = document.getElementById("manual-date").value;
    const time = document.getElementById("manual-time").value;
    const type = document.getElementById("manual-type").value;
    if (!addRecordAtDateTime(dayKey, time, type)) return;

    state.selectedDateKey = dayKey;
    state.calendarCursor = startOfMonth(parseDayKey(dayKey));
    saveData();
    refreshAdminSummaryForCurrentMonth();
    renderAll();
  });

  const metricCards = [
    { id: "gross-revenue-per-hour-card", focusMetric: "grossRevenuePerHour" },
    { id: "gross-consults-per-hour-card", focusMetric: "grossConsultationsPerHour" },
    { id: "net-revenue-per-hour-card", focusMetric: "netRevenuePerHour" },
    { id: "net-consults-per-hour-card", focusMetric: "netConsultationsPerHour" },
  ];

  const handleCardKeyboard = (event, focusMetric) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    openHourlyModal(focusMetric);
  };

  for (const card of metricCards) {
    const element = document.getElementById(card.id);
    element.addEventListener("click", () => openHourlyModal(card.focusMetric));
    element.addEventListener("keydown", (event) => handleCardKeyboard(event, card.focusMetric));
  }

  const overlay = document.getElementById("hourly-modal");
  document.getElementById("close-hourly-modal").addEventListener("click", closeHourlyModal);
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) closeHourlyModal();
  });

  const editOverlay = document.getElementById("edit-record-modal");
  document
    .getElementById("close-edit-record-modal")
    .addEventListener("click", closeEditRecordModal);
  editOverlay.addEventListener("click", (event) => {
    if (event.target === editOverlay) closeEditRecordModal();
  });

  document.getElementById("edit-record-form").addEventListener("submit", (event) => {
    event.preventDefault();
    saveEditedRecordFromModal();
  });

  document.getElementById("delete-record-btn").addEventListener("click", () => {
    if (!state.editingRecordId) return;
    if (!deleteRecordById(state.editingRecordId)) {
      closeEditRecordModal();
      return;
    }
    saveData();
    refreshAdminSummaryForCurrentMonth();
    renderAll();
    closeEditRecordModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (state.hourlyModal.isOpen) closeHourlyModal();
    if (state.editingRecordId) closeEditRecordModal();
  });
}

async function initApp() {
  bindEvents();
  if (!(await tryRestoreSession())) showAuthScreen();
}

initApp();

setInterval(() => {
  if (state.currentUserEmail && isToday(state.selectedDateKey)) {
    const metrics = computeDayMetrics(state.selectedDateKey);
    renderMetrics(metrics);
    renderMonthGoalMetrics();
    renderAdminPanel();
  }
}, 60 * 1000);
