function json(statusCode, body, headers = {}) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...headers,
    },
    body: JSON.stringify(body),
  };
}

function methodNotAllowed() {
  return json(405, { message: "Método não permitido." });
}

function parseJsonBody(event) {
  if (!event.body) return {};
  try {
    return JSON.parse(event.body);
  } catch (err) {
    return null;
  }
}

module.exports = {
  json,
  methodNotAllowed,
  parseJsonBody,
};
