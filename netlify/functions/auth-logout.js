const { json, methodNotAllowed } = require("./_lib/http");
const { makeExpiredSessionCookie } = require("./_lib/session");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return methodNotAllowed();

  return json(
    200,
    { message: "Sessão encerrada." },
    {
      "Set-Cookie": makeExpiredSessionCookie(),
    }
  );
};
