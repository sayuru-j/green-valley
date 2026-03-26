const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../database");
const config = require("../config");
const requireAdmin = require("../middleware/requireAdmin");

const router = express.Router();

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Invalid" });
  }

  db.query(
    "SELECT id, username, password FROM admins WHERE username = ?",
    [username],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Error" });

      if (results.length === 0) {
        return res.status(401).json({ message: "Invalid" });
      }

      const admin = results[0];
      bcrypt.compare(password, admin.password, (compareErr, ok) => {
        if (compareErr || !ok) {
          return res.status(401).json({ message: "Invalid" });
        }

        const token = jwt.sign(
          { sub: String(admin.id), username: admin.username },
          config.jwtSecret,
          { expiresIn: config.jwtExpiresIn }
        );

        res.json({
          token,
          user: { username: admin.username },
        });
      });
    }
  );
});

router.get("/me", requireAdmin, (req, res) => {
  res.json({ user: { id: req.admin.id, username: req.admin.username } });
});

module.exports = router;
