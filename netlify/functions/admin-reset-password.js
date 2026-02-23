const bcrypt = require("bcryptjs");
const {
  findUserByEmail,
  normalizeEmail,
  prepareDatabase,
  setUserPasswordHash,
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
  if (!session?.email) {
    return json(401, { message: "Não autenticado." });
  }

  const body = parseJsonBody(event);
  if (!body || typeof body !== "object") {
    return json(400, { message: "JSON inválido." });
  }

  const targetEmail = normalizeEmail(body.email);
  const newPassword = String(body.newPassword || "");

  if (!targetEmail || !targetEmail.includes("@")) {
    return json(400, { message: "E-mail alvo inválido." });
  }
  if (newPassword.length < 6) {
    return json(400, { message: "A nova senha deve ter pelo menos 6 caracteres." });
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

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await setUserPasswordHash(targetEmail, passwordHash);

    return json(200, { message: `Senha redefinida para ${targetEmail}.` });
  } catch (err) {
    console.error(err);
    return json(500, { message: "Não foi possível redefinir a senha." });
  }
};
