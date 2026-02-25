const { findUserByEmail, listUsers, prepareDatabase } = require("./_lib/db");
const { json, methodNotAllowed } = require("./_lib/http");
const { getSessionFromEvent } = require("./_lib/session");

const MS_HOUR = 60 * 60 * 1000;
const MIN_CONSULTS_FOR_AVERAGES = 5;
const MAX_NET_CONSULTS_PER_HOUR = 20;
const MAX_NET_REVENUE_PER_HOUR = 500;
const TYPE_PRICE = {
  adulto: 15,
  pediatria: 20,
  one: 20,
  plantao: 20,
};

function isDayKeyValid(dayKey) {
  return /^\d{4}-\d{2}-\d{2}$/.test(dayKey || "");
}

function getDayPauseEntries(data, dayKey) {
  const entries = Array.isArray(data?.settings?.manualPauses?.[dayKey])
    ? data.settings.manualPauses[dayKey]
    : [];
  return entries
    .map((entry) => ({
      startTs: Number(entry?.startTs),
      endTs: Number(entry?.endTs),
    }))
    .filter((entry) => Number.isFinite(entry.startTs) && Number.isFinite(entry.endTs) && entry.endTs > entry.startTs)
    .sort((a, b) => a.startTs - b.startTs);
}

function getOverlapMinutes(startTs, endTs, pauseEntries) {
  let overlapMs = 0;
  for (const entry of pauseEntries) {
    const start = Math.max(startTs, entry.startTs);
    const end = Math.min(endTs, entry.endTs);
    if (end > start) overlapMs += end - start;
  }
  return overlapMs / 60000;
}

function computeNetDayMetrics(data, dayKey) {
  const recordsRaw = Array.isArray(data?.days?.[dayKey]) ? data.days[dayKey] : [];
  const records = recordsRaw
    .map((record) => ({ ts: Number(record?.ts), type: record?.type }))
    .filter((record) => Number.isFinite(record.ts) && TYPE_PRICE[record.type] !== undefined)
    .sort((a, b) => a.ts - b.ts);

  const total = records.length;
  const revenue = records.reduce((sum, record) => sum + TYPE_PRICE[record.type], 0);
  if (total < MIN_CONSULTS_FOR_AVERAGES) {
    return { total, revenue, netConsultationsPerHour: null, netRevenuePerHour: null };
  }

  const totalClockHours = total > 1 ? (records[records.length - 1].ts - records[0].ts) / MS_HOUR : 0;
  if (!(totalClockHours > 0)) {
    return { total, revenue, netConsultationsPerHour: null, netRevenuePerHour: null };
  }

  const pauseThresholdMin = Number(data?.settings?.pauseThresholdMin);
  const threshold = Number.isFinite(pauseThresholdMin) && pauseThresholdMin > 0 ? pauseThresholdMin : 20;
  const manualPauses = getDayPauseEntries(data, dayKey);

  let automaticPauseMinutes = 0;
  for (let i = 1; i < records.length; i += 1) {
    const previousTs = records[i - 1].ts;
    const currentTs = records[i].ts;
    const intervalMin = (currentTs - previousTs) / 60000;
    const overlapMin = getOverlapMinutes(previousTs, currentTs, manualPauses);
    const effectiveInterval = Math.max(intervalMin - overlapMin, 0);
    if (effectiveInterval > threshold) automaticPauseMinutes += effectiveInterval;
  }

  const manualPauseMinutes = manualPauses.reduce(
    (sum, entry) => sum + Math.max((entry.endTs - entry.startTs) / 60000, 0),
    0
  );

  const activeHours = Math.max(totalClockHours - automaticPauseMinutes / 60 - manualPauseMinutes / 60, 0);
  if (!(activeHours > 0)) {
    return { total, revenue, netConsultationsPerHour: null, netRevenuePerHour: null };
  }

  return {
    total,
    revenue,
    netConsultationsPerHour: total / activeHours,
    netRevenuePerHour: revenue / activeHours,
  };
}

exports.handler = async (event) => {
  if (event.httpMethod !== "GET") return methodNotAllowed();

  try {
    await prepareDatabase();
  } catch (err) {
    console.error(err);
    return json(500, { message: "Erro ao conectar no banco de dados." });
  }

  const session = getSessionFromEvent(event);
  if (!session?.email) return json(401, { message: "Não autenticado." });

  const dayKey = isDayKeyValid(event.queryStringParameters?.dayKey)
    ? event.queryStringParameters.dayKey
    : null;

  if (!dayKey) {
    return json(400, { message: "Parâmetro dayKey inválido. Use o formato YYYY-MM-DD." });
  }

  try {
    const currentUser = await findUserByEmail(session.email);
    if (!currentUser) return json(401, { message: "Sessão inválida." });

    if (currentUser.shareEnabled === false) {
      return json(200, {
        canViewNetwork: false,
        reason: "Compartilhamento desativado para sua conta.",
        dayKey,
      });
    }

    const users = await listUsers();
    const sharedOthers = users.filter(
      (user) => user.email !== currentUser.email && user.shareEnabled !== false
    );

    const activeRows = [];
    let activeAccountsCount = 0;
    let ignoredOutliers = 0;
    for (const user of sharedOthers) {
      const metrics = computeNetDayMetrics(user.data, dayKey);
      if (!(metrics.total > 0)) continue;
      activeAccountsCount += 1;
      if (metrics.netConsultationsPerHour === null || metrics.netRevenuePerHour === null) continue;

      if (
        metrics.netConsultationsPerHour > MAX_NET_CONSULTS_PER_HOUR ||
        metrics.netRevenuePerHour > MAX_NET_REVENUE_PER_HOUR
      ) {
        ignoredOutliers += 1;
        continue;
      }

      activeRows.push({
        email: user.email,
        total: metrics.total,
        netConsultationsPerHour: metrics.netConsultationsPerHour,
        netRevenuePerHour: metrics.netRevenuePerHour,
      });
    }

    const includedAccounts = activeRows.length;
    const averageNetConsultationsPerHour =
      includedAccounts > 0
        ? activeRows.reduce((sum, row) => sum + row.netConsultationsPerHour, 0) / includedAccounts
        : null;
    const averageNetRevenuePerHour =
      includedAccounts > 0
        ? activeRows.reduce((sum, row) => sum + row.netRevenuePerHour, 0) / includedAccounts
        : null;

    return json(200, {
      canViewNetwork: true,
      dayKey,
      activeAccounts: activeAccountsCount,
      includedAccounts,
      ignoredOutliers,
      averageNetConsultationsPerHour,
      averageNetRevenuePerHour,
      accounts: activeRows,
      limits: {
        maxNetConsultationsPerHour: MAX_NET_CONSULTS_PER_HOUR,
        maxNetRevenuePerHour: MAX_NET_REVENUE_PER_HOUR,
      },
    });
  } catch (err) {
    console.error(err);
    return json(500, { message: "Não foi possível carregar as métricas das contas ativas." });
  }
};
