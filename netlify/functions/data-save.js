const { findUserByEmail, prepareDatabase, updateUserData } = require("./_lib/db");
const { normalizeData } = require("./_lib/data");
const { json, methodNotAllowed, parseJsonBody } = require("./_lib/http");
const { getSessionFromEvent } = require("./_lib/session");

exports.handler = async (event) => {
  if (event.httpMethod !== "PUT") return methodNotAllowed();

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

  const body = parseJsonBody(event);
  if (!body || typeof body !== "object") {
    return json(400, { message: "JSON inválido." });
  }

  try {
    const user = await findUserByEmail(session.email);
    if (!user) return json(401, { message: "Sessão inválida." });

    const normalizedData = normalizeData(body.data || {});
    const savedData = await updateUserData(user.email, normalizedData);
    return json(200, {
      message: "Dados salvos com sucesso.",
      data: savedData,
    });
  } catch (err) {
    console.error(err);
    return json(500, { message: "Não foi possível salvar os dados." });
  }
};
