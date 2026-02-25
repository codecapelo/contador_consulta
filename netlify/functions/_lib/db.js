const bcrypt = require("bcryptjs");
const { Pool } = require("pg");
const { createEmptyData, normalizeData } = require("./data");

let pool;
let setupPromise;

function getDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL não configurada.");
  }
  return databaseUrl;
}

function getPool() {
  if (!pool) {
    const connectionString = getDatabaseUrl();
    const useSSL = !/(localhost|127\.0\.0\.1)/i.test(connectionString);
    pool = new Pool({
      connectionString,
      ssl: useSSL ? { rejectUnauthorized: false } : false,
      max: 3,
    });
  }
  return pool;
}

async function query(text, params = []) {
  const client = getPool();
  return client.query(text, params);
}

async function ensureSchema() {
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id BIGSERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      share_enabled BOOLEAN NOT NULL DEFAULT TRUE,
      data JSONB NOT NULL DEFAULT '{"days":{},"settings":{"targetHours":8,"pauseThresholdMin":20,"monthlyGoals":{},"completedImports":[]}}'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      CHECK (role IN ('admin', 'user'))
    );
  `);
  await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS share_enabled BOOLEAN NOT NULL DEFAULT TRUE;`);
}

async function ensureAdminUser() {
  const adminEmail = normalizeEmail(process.env.ADMIN_EMAIL || "");
  const adminPassword = String(process.env.ADMIN_PASSWORD || "");

  if (!adminEmail || !adminPassword) {
    console.warn("ADMIN_EMAIL/ADMIN_PASSWORD não configurados; bootstrap do admin ignorado.");
    return;
  }

  const existing = await query(
    `SELECT email, role FROM users WHERE email = $1 LIMIT 1`,
    [adminEmail]
  );

  if (existing.rowCount === 0) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await query(
      `INSERT INTO users (email, password_hash, role, data) VALUES ($1, $2, 'admin', $3::jsonb)`,
      [adminEmail, passwordHash, JSON.stringify(createEmptyData())]
    );
    return;
  }

  const role = existing.rows[0].role;
  if (role !== "admin") {
    await query(`UPDATE users SET role = 'admin', updated_at = NOW() WHERE email = $1`, [adminEmail]);
  }
}

async function prepareDatabase() {
  if (!setupPromise) {
    setupPromise = (async () => {
      await ensureSchema();
      await ensureAdminUser();
    })();
  }
  return setupPromise;
}

function normalizeEmail(email) {
  return String(email || "")
    .trim()
    .toLowerCase();
}

async function findUserByEmail(email) {
  const emailKey = normalizeEmail(email);
  if (!emailKey) return null;

  const result = await query(
    `SELECT email, password_hash, role, share_enabled, data FROM users WHERE email = $1 LIMIT 1`,
    [emailKey]
  );
  if (result.rowCount === 0) return null;
  const row = result.rows[0];
  return {
    email: row.email,
    passwordHash: row.password_hash,
    role: row.role,
    shareEnabled: row.share_enabled !== false,
    data: normalizeData(row.data || createEmptyData()),
  };
}

async function createUser({ email, passwordHash, role = "user" }) {
  const emailKey = normalizeEmail(email);
  const normalizedData = normalizeData(createEmptyData());
  await query(
    `INSERT INTO users (email, password_hash, role, share_enabled, data) VALUES ($1, $2, $3, TRUE, $4::jsonb)`,
    [emailKey, passwordHash, role, JSON.stringify(normalizedData)]
  );
  return {
    email: emailKey,
    role,
    shareEnabled: true,
    data: normalizedData,
  };
}

async function updateUserData(email, data) {
  const emailKey = normalizeEmail(email);
  const normalizedData = normalizeData(data || createEmptyData());
  await query(
    `UPDATE users SET data = $2::jsonb, updated_at = NOW() WHERE email = $1`,
    [emailKey, JSON.stringify(normalizedData)]
  );
  return normalizedData;
}

async function setUserPasswordHash(email, passwordHash) {
  const emailKey = normalizeEmail(email);
  await query(`UPDATE users SET password_hash = $2, updated_at = NOW() WHERE email = $1`, [
    emailKey,
    String(passwordHash || ""),
  ]);
}

async function deleteUserByEmail(email) {
  const emailKey = normalizeEmail(email);
  const result = await query(`DELETE FROM users WHERE email = $1`, [emailKey]);
  return result.rowCount > 0;
}

async function updateUserShareEnabled(email, shareEnabled) {
  const emailKey = normalizeEmail(email);
  const enabled = shareEnabled !== false;
  await query(`UPDATE users SET share_enabled = $2, updated_at = NOW() WHERE email = $1`, [
    emailKey,
    enabled,
  ]);
  return enabled;
}

async function listUsers() {
  const result = await query(`SELECT email, role, share_enabled, data FROM users ORDER BY email ASC`);
  return result.rows.map((row) => ({
    email: row.email,
    role: row.role,
    shareEnabled: row.share_enabled !== false,
    data: normalizeData(row.data || createEmptyData()),
  }));
}

module.exports = {
  prepareDatabase,
  normalizeEmail,
  findUserByEmail,
  createUser,
  updateUserData,
  setUserPasswordHash,
  deleteUserByEmail,
  updateUserShareEnabled,
  listUsers,
};
