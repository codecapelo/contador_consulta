const { randomUUID } = require("crypto");

const DEFAULT_PAUSE_THRESHOLD_MIN = 20;
const TYPE_SET = new Set(["adulto", "pediatria", "one", "plantao"]);

function createId() {
  return randomUUID();
}

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

module.exports = {
  createEmptyData,
  normalizeData,
};
