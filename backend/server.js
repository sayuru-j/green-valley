const config = require("./config");
const db = require("./database");
const ensureSchema = require("./lib/ensureSchema");
const seedDevDataIfNeeded = require("./lib/seedDevData");

async function start() {
  try {
    if (config.autoSyncSchema) {
      await ensureSchema(db);
      console.log("[schema] Database schema verified.");
    }
    if (!config.isProduction) {
      await seedDevDataIfNeeded(db);
    }
    const app = require("./app");
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch (err) {
    console.error("[schema] Failed to initialize database:", err);
    process.exit(1);
  }
}

start();
