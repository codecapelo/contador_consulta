const {
  findUserByEmail,
  normalizeEmail,
  prepareDatabase,
  updateUserShareEnabled,
} = require("./_lib/db");
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

  const targetEmail = normalizeEmail(body.email);
  if (!targetEmail || !targetEmail.includes("@")) {
    return json(400, { message: "E-mail alvo inválido." });
  }

  try {
    const currentUser = await findUserByEmail(session.email);
    if (!currentUser || currentUser.role !== "admin") {
      return json(403, { message: "Acesso restrito ao administrador." });
    }

    const targetUser = await findUserByEmail(targetEmail);
    if (!targetUser) {
      return json(404, { message: "Conta não encontrada." });
    }

    const shareEnabled = body.shareEnabled !== false;
    const saved = await updateUserShareEnabled(targetEmail, shareEnabled);

    return json(200, {
      message: `${targetEmail} agora está ${saved ? "com compartilhamento ativo" : "com compartilhamento desativado"}.`,
      user: {
        email: targetUser.email,
        shareEnabled: saved,
      },
    });
  } catch (err) {
    console.error(err);
    return json(500, { message: "Não foi possível atualizar o compartilhamento desta conta." });
  }
};
