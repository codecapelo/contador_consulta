const jwt = require("jsonwebtoken");

const TOKEN_COOKIE_NAME = "consultas_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET não configurado.");
  }
  return secret;
}

function createSessionToken(payload) {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: SESSION_MAX_AGE_SECONDS,
  });
}

function verifySessionToken(token) {
  try {
    return jwt.verify(token, getJwtSecret());
  } catch (err) {
    return null;
  }
}

function parseCookieHeader(cookieHeader) {
  const cookies = {};
  if (!cookieHeader) return cookies;

  const parts = cookieHeader.split(";");
  for (const part of parts) {
    const [rawName, ...rawValueParts] = part.trim().split("=");
    if (!rawName) continue;
    cookies[rawName] = decodeURIComponent(rawValueParts.join("="));
  }

  return cookies;
}

function getSessionFromEvent(event) {
  const cookieHeader = event.headers?.cookie || event.headers?.Cookie || "";
  const cookies = parseCookieHeader(cookieHeader);
  const token = cookies[TOKEN_COOKIE_NAME];
  if (!token) return null;
  return verifySessionToken(token);
}

function makeSessionCookie(token) {
  const isLocalDev = process.env.CONTEXT === "dev";
  const secure = isLocalDev ? "" : "; Secure";
  return `${TOKEN_COOKIE_NAME}=${encodeURIComponent(
    token
  )}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_MAX_AGE_SECONDS}${secure}`;
}

function makeExpiredSessionCookie() {
  const isLocalDev = process.env.CONTEXT === "dev";
  const secure = isLocalDev ? "" : "; Secure";
  return `${TOKEN_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`;
}

module.exports = {
  createSessionToken,
  getSessionFromEvent,
  makeSessionCookie,
  makeExpiredSessionCookie,
};
