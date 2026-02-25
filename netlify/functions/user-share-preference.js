const { findUserByEmail, prepareDatabase, updateUserShareEnabled } = require("./_lib/db");
const { json, methodNotAllowed, parseJsonBody } = require("./_lib/http");
const { getSessionFromEvent } = require("./_lib/session");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return methodNotAllowed();

  try {
    await prepareDatabase();
  } catch (err) {
    console.error(err);
    return json(500, { message: "Erro ao conectar no banco de dados." });
  }

  const session = getSessionFromEvent(event);
  if (!session?.email) return json(401, { message: "Não autenticado." });

  const body = parseJsonBody(event);
  if (!body || typeof body !== "object") {
    return json(400, { message: "JSON inválido." });
  }

  try {
    const currentUser = await findUserByEmail(session.email);
    if (!currentUser) return json(401, { message: "Sessão inválida." });

    const shareEnabled = body.shareEnabled !== false;
    const saved = await updateUserShareEnabled(currentUser.email, shareEnabled);

    return json(200, {
      message: saved
        ? "Você voltou a compartilhar suas métricas."
        : "Você deixou de compartilhar suas métricas.",
      user: {
        email: currentUser.email,
        role: currentUser.role,
        shareEnabled: saved,
      },
    });
  } catch (err) {
    console.error(err);
    return json(500, { message: "Não foi possível atualizar a preferência de compartilhamento." });
  }
};
