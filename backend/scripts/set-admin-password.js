/**
 * One-time or ad-hoc: set an admin's password to a bcrypt hash in the database.
 * Usage from backend folder:
 *   npm run set-admin-password -- <username> <newPassword>
 *   node scripts/set-admin-password.js <username> <newPassword>
 */
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const bcrypt = require("bcryptjs");
const db = require("../database");

const username = process.argv[2];
const newPassword = process.argv[3];

if (!username || !newPassword) {
  console.error("Usage: node scripts/set-admin-password.js <username> <newPassword>");
  process.exit(1);
}

const rounds = 10;

bcrypt.hash(newPassword, rounds, (err, hash) => {
  if (err) {
    console.error(err);
    db.end(() => process.exit(1));
    return;
  }

  db.query(
    "UPDATE admins SET password = ? WHERE username = ?",
    [hash, username],
    (qerr, result) => {
      if (qerr) {
        console.error(qerr);
        db.end(() => process.exit(1));
        return;
      }

      const changed = result && result.affectedRows;
      if (!changed) {
        console.error(`No admin found with username: ${username}`);
        db.end(() => process.exit(1));
        return;
      }

      console.log(`Password updated for admin "${username}".`);
      db.end(() => process.exit(0));
    }
  );
});
