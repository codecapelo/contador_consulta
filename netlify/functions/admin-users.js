const { findUserByEmail, listUsers, prepareDatabase } = require("./_lib/db");
const { json, methodNotAllowed } = require("./_lib/http");
const { getSessionFromEvent } = require("./_lib/session");

const TYPE_PRICE = {
  adulto: 15,
  pediatria: 20,
  one: 20,
  plantao: 20,
};

function getMonthSummaryForData(data, monthKey) {
  let revenue = 0;
  let consults = 0;
  let activeDays = 0;

  for (const [dayKey, records] of Object.entries(data?.days || {})) {
    if (!dayKey.startsWith(`${monthKey}-`)) continue;
    if (!Array.isArray(records) || records.length === 0) continue;
    activeDays += 1;

    for (const record of records) {
      consults += 1;
      revenue += TYPE_PRICE[record.type] || 0;
    }
  }

  return { revenue, consults, activeDays };
}

function getMonthKeyFromDate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
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
  if (!session?.email) {
    return json(401, { message: "Não autenticado." });
  }

  const monthKey =
    typeof event.queryStringParameters?.monthKey === "string" &&
    /^\d{4}-\d{2}$/.test(event.queryStringParameters.monthKey)
      ? event.queryStringParameters.monthKey
      : getMonthKeyFromDate();

  try {
    const currentUser = await findUserByEmail(session.email);
    if (!currentUser || currentUser.role !== "admin") {
      return json(403, { message: "Acesso restrito ao administrador." });
    }

    const users = await listUsers();
    const rows = users.map((user) => {
      const summary = getMonthSummaryForData(user.data, monthKey);
      return {
        email: user.email,
        role: user.role,
        shareEnabled: user.shareEnabled !== false,
        consults: summary.consults,
        revenue: summary.revenue,
        activeDays: summary.activeDays,
      };
    });

    return json(200, { monthKey, users: rows });
  } catch (err) {
    console.error(err);
    return json(500, { message: "Não foi possível carregar o painel administrador." });
  }
};
