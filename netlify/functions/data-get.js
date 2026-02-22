const { findUserByEmail, prepareDatabase } = require("./_lib/db");
const { json, methodNotAllowed } = require("./_lib/http");
const { getSessionFromEvent } = require("./_lib/session");

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

  try {
    const user = await findUserByEmail(session.email);
    if (!user) return json(401, { message: "Sessão inválida." });

    return json(200, {
      user: { email: user.email, role: user.role },
      data: user.data,
    });
  } catch (err) {
    console.error(err);
    return json(500, { message: "Não foi possível carregar os dados." });
  }
};
