const express = require("express");
const db = require("../database");
const requireAdmin = require("../middleware/requireAdmin");

const router = express.Router();

function clampRating(v) {
  const n = parseInt(v, 10);
  if (!Number.isFinite(n)) return null;
  if (n < 1) return 1;
  if (n > 5) return 5;
  return n;
}

function optionalLocation(v) {
  if (v === undefined || v === null) return null;
  const s = String(v).trim();
  return s === "" ? null : s;
}

function trimStr(v) {
  if (v === undefined || v === null) return "";
  return String(v).trim();
}

function approvedFlag(v) {
  return v === true || v === 1 || v === "1" ? 1 : 0;
}

router.get("/all", requireAdmin, (req, res) => {
  db.query(
    `SELECT id, guest_name, location, rating, body, is_approved, created_at
     FROM guest_reviews
     ORDER BY is_approved ASC, created_at DESC`,
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Fetch failed" });
      }
      res.json(results);
    }
  );
});

router.get("/", (req, res) => {
  db.query(
    `SELECT id, guest_name, location, rating, body, created_at
     FROM guest_reviews
     WHERE is_approved = 1
     ORDER BY created_at DESC`,
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Fetch failed" });
      }
      res.json(results);
    }
  );
});

router.post("/", (req, res) => {
  const guest_name = trimStr(req.body.guest_name);
  const body = trimStr(req.body.body);
  const location = optionalLocation(req.body.location);
  const rating = clampRating(req.body.rating);

  if (!guest_name || !body) {
    return res.status(400).json({ error: "Name and review text are required." });
  }
  if (rating === null) {
    return res.status(400).json({ error: "Rating must be between 1 and 5." });
  }

  db.query(
    `INSERT INTO guest_reviews (guest_name, location, rating, body, is_approved)
     VALUES (?, ?, ?, ?, 0)`,
    [guest_name, location, rating, body],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Could not save review." });
      }
      res.status(201).json({
        message:
          "Thank you — your review will appear after it's approved.",
        id: result.insertId,
      });
    }
  );
});

router.patch("/:id", requireAdmin, (req, res) => {
  const { id } = req.params;
  if (req.body.is_approved === undefined) {
    return res.status(400).json({ error: "is_approved is required" });
  }
  const flag = approvedFlag(req.body.is_approved);
  db.query(
    "UPDATE guest_reviews SET is_approved = ? WHERE id = ?",
    [flag, id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Update failed" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Not found" });
      }
      res.json({ message: "Updated" });
    }
  );
});

router.delete("/:id", requireAdmin, (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM guest_reviews WHERE id = ?", [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Delete failed" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Not found" });
    }
    res.json({ message: "Deleted" });
  });
});

module.exports = router;
