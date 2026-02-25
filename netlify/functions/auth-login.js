const bcrypt = require("bcryptjs");
const { findUserByEmail, normalizeEmail, prepareDatabase } = require("./_lib/db");
const { json, methodNotAllowed, parseJsonBody } = require("./_lib/http");
const { createSessionToken, makeSessionCookie } = require("./_lib/session");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return methodNotAllowed();

  try {
    await prepareDatabase();
  } catch (err) {
    console.error(err);
    return json(500, { message: "Erro ao conectar no banco de dados." });
  }

  const body = parseJsonBody(event);
  if (!body) return json(400, { message: "JSON inválido." });

  const email = normalizeEmail(body.email);
  const password = String(body.password || "");

  if (!email || !password) {
    return json(400, { message: "E-mail e senha são obrigatórios." });
  }

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return json(404, { message: "Conta não encontrada." });
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return json(401, { message: "Senha incorreta." });
    }

    const token = createSessionToken({
      email: user.email,
      role: user.role,
    });

    return json(
      200,
      {
        user: { email: user.email, role: user.role, shareEnabled: user.shareEnabled !== false },
        data: user.data,
      },
      {
        "Set-Cookie": makeSessionCookie(token),
      }
    );
  } catch (err) {
    console.error(err);
    return json(500, { message: "Não foi possível realizar login." });
  }
};
