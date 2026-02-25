const { randomUUID } = require("crypto");

const DEFAULT_PAUSE_THRESHOLD_MIN = 20;
const TYPE_SET = new Set(["adulto", "pediatria", "one", "plantao"]);

function createId() {
  return randomUUID();
}

function dayBoundsFromKey(dayKey) {
  const [year, month, day] = dayKey.split("-").map(Number);
  const startTs = new Date(year, month - 1, day, 0, 0, 0, 0).getTime();
  const endTs = new Date(year, month - 1, day, 23, 59, 59, 999).getTime();
  return { startTs, endTs };
}

function normalizePauseEntriesForDay(entries, dayKey) {
  if (!Array.isArray(entries)) return [];
  const { startTs: dayStartTs, endTs: dayEndTs } = dayBoundsFromKey(dayKey);

  return entries
    .map((entry) => {
      const startTs = Number(entry?.startTs);
      const endTs = Number(entry?.endTs);
      if (!Number.isFinite(startTs) || !Number.isFinite(endTs) || endTs <= startTs) return null;
      const boundedStart = Math.max(startTs, dayStartTs);
      const boundedEnd = Math.min(endTs, dayEndTs);
      if (!Number.isFinite(boundedStart) || !Number.isFinite(boundedEnd) || boundedEnd <= boundedStart) {
        return null;
      }
      return { startTs: boundedStart, endTs: boundedEnd };
    })
    .filter(Boolean)
    .sort((a, b) => a.startTs - b.startTs);
}

function createEmptyData() {
  return {
    days: {},
    settings: {
      targetHours: 8,
      pauseThresholdMin: DEFAULT_PAUSE_THRESHOLD_MIN,
      monthlyGoals: {},
      completedImports: [],
      manualPauses: {},
      activePause: null,
    },
  };
}

function normalizeData(parsed) {
  const days = {};
  for (const [dayKey, records] of Object.entries(parsed?.days || {})) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dayKey) || !Array.isArray(records)) continue;

    const clean = records
      .map((record) => ({
        id: typeof record?.id === "string" && record.id ? record.id : createId(),
        type: TYPE_SET.has(record?.type) ? record.type : null,
        ts: Number(record?.ts),
      }))
      .filter((record) => record.type && Number.isFinite(record.ts))
      .sort((a, b) => a.ts - b.ts);

    if (clean.length > 0) {
      days[dayKey] = clean;
    }
  }

  const targetHours = Number(parsed?.settings?.targetHours);
  const pauseThresholdMin = Number(parsed?.settings?.pauseThresholdMin);
  const monthlyGoals = {};
  const monthlyGoalsRaw = parsed?.settings?.monthlyGoals;
  if (monthlyGoalsRaw && typeof monthlyGoalsRaw === "object") {
    for (const [monthKey, value] of Object.entries(monthlyGoalsRaw)) {
      const numeric = Number(value);
      if (/^\d{4}-\d{2}$/.test(monthKey) && Number.isFinite(numeric) && numeric >= 0) {
        monthlyGoals[monthKey] = numeric;
      }
    }
  }

  const completedImports = Array.isArray(parsed?.settings?.completedImports)
    ? parsed.settings.completedImports.filter((value) => typeof value === "string")
    : [];

  const manualPausesRaw = parsed?.settings?.manualPauses;
  const manualPauses = {};
  if (manualPausesRaw && typeof manualPausesRaw === "object") {
    for (const [dayKey, entries] of Object.entries(manualPausesRaw)) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dayKey)) continue;
      const normalizedEntries = normalizePauseEntriesForDay(entries, dayKey);
      if (normalizedEntries.length > 0) {
        manualPauses[dayKey] = normalizedEntries;
      }
    }
  }

  const activePauseRaw = parsed?.settings?.activePause;
  let activePause = null;
  if (
    activePauseRaw &&
    typeof activePauseRaw === "object" &&
    /^\d{4}-\d{2}-\d{2}$/.test(String(activePauseRaw.dayKey || ""))
  ) {
    const dayKey = String(activePauseRaw.dayKey);
    const startTs = Number(activePauseRaw.startTs);
    if (Number.isFinite(startTs)) {
      const { startTs: dayStartTs, endTs: dayEndTs } = dayBoundsFromKey(dayKey);
      const boundedStart = Math.min(Math.max(startTs, dayStartTs), dayEndTs);
      activePause = { dayKey, startTs: boundedStart };
    }
  }

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
      manualPauses,
      activePause,
    },
  };
}

module.exports = {
  createEmptyData,
  normalizeData,
};
