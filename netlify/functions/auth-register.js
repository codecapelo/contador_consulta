const bcrypt = require("bcryptjs");
const { createUser, findUserByEmail, normalizeEmail, prepareDatabase } = require("./_lib/db");
const { json, methodNotAllowed, parseJsonBody } = require("./_lib/http");

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

  if (!email || !email.includes("@")) {
    return json(400, { message: "Informe um e-mail válido." });
  }
  if (password.length < 6) {
    return json(400, { message: "A senha deve ter pelo menos 6 caracteres." });
  }

  try {
    const existing = await findUserByEmail(email);
    if (existing) {
      return json(409, { message: "Este e-mail já está cadastrado." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await createUser({ email, passwordHash, role: "user" });
    return json(201, { message: "Cadastro criado. Faça login." });
  } catch (err) {
    console.error(err);
    return json(500, { message: "Não foi possível criar o cadastro." });
  }
};
