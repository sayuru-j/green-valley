const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const isProduction = process.env.NODE_ENV === "production";

function envString(name, defaultValue) {
  const v = process.env[name];
  if (v === undefined || v === "") {
    return defaultValue;
  }
  return v;
}

function missing(name) {
  throw new Error(`Missing required environment variable: ${name}`);
}

const dbHost = envString("DB_HOST", "localhost");
const dbPort = Number(envString("DB_PORT", "3306")) || 3306;
const dbUser = envString("DB_USER", isProduction ? undefined : "root");
const dbPassword =
  process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : "";
const dbName = envString("DB_NAME", isProduction ? undefined : "green_valley");

if (isProduction) {
  if (!dbUser) missing("DB_USER");
  if (!dbName) missing("DB_NAME");
  if (!process.env.CORS_ORIGIN) missing("CORS_ORIGIN");
}

const port = Number(envString("PORT", "5000")) || 5000;
const corsOrigin = process.env.CORS_ORIGIN || null;

let jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  if (isProduction) {
    missing("JWT_SECRET");
  }
  jwtSecret = "dev-insecure-jwt-secret-change-in-production";
  console.warn(
    "[config] JWT_SECRET not set; using insecure dev default. Set JWT_SECRET in .env for real use."
  );
}

const jwtExpiresIn = envString("JWT_EXPIRES_IN", "7d");

function envBool(name, defaultValue) {
  const v = process.env[name];
  if (v === undefined || v === "") {
    return defaultValue;
  }
  return !["0", "false", "no"].includes(String(v).trim().toLowerCase());
}

const autoSyncSchema = envBool("DB_AUTO_SYNC", true);

module.exports = {
  isProduction,
  port,
  corsOrigin,
  jwtSecret,
  jwtExpiresIn,
  autoSyncSchema,
  db: {
    host: dbHost,
    port: dbPort,
    user: dbUser,
    password: dbPassword,
    database: dbName,
  },
};
