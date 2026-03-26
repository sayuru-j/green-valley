const db = require("../../database");

db.query("DROP TABLE IF EXISTS banquet", (error) => {
  if (error) {
    console.error("Error dropping table:", error);
    db.end(() => process.exit(1));
    return;
  }
  console.log("Success: Dropped obsolete banquet table.");
  db.end(() => process.exit(0));
});
