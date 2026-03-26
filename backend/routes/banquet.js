const express = require("express");
const db = require("../database");
const requireAdmin = require("../middleware/requireAdmin");

const router = express.Router();

function displayOrder(v) {
  if (v === undefined || v === null || v === "") return 0;
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : 0;
}

function optionalString(v) {
  if (v === undefined || v === null) return null;
  const s = String(v).trim();
  return s === "" ? null : s;
}

function numOrNull(v) {
  if (v === undefined || v === null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : null;
}

router.get("/", (req, res) => {
  db.query(
    "SELECT * FROM banquet_packages ORDER BY display_order ASC, id ASC",
    (err, results) => {
      if (err) return res.status(500).json({ error: "Fetch failed" });
      res.json(results);
    }
  );
});

router.post("/", requireAdmin, (req, res) => {
  const { name, description, price } = req.body;
  if (!name || !description || price === undefined || price === null) {
    return res.status(400).json({ error: "All fields required" });
  }

  const image_url = optionalString(req.body.image_url);
  const max_guests = numOrNull(req.body.max_guests);
  const highlights = optionalString(req.body.highlights);
  const display_order = displayOrder(req.body.display_order);

  db.query(
    `INSERT INTO banquet_packages (name, description, price, image_url, max_guests, highlights, display_order)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, description, price, image_url, max_guests, highlights, display_order],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Insert failed" });
      res.json({ message: "Package added successfully", id: result.insertId });
    }
  );
});

router.put("/:id", requireAdmin, (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;
  const image_url = optionalString(req.body.image_url);
  const max_guests = numOrNull(req.body.max_guests);
  const highlights = optionalString(req.body.highlights);
  const display_order = displayOrder(req.body.display_order);

  db.query(
    `UPDATE banquet_packages SET name = ?, description = ?, price = ?, image_url = ?,
     max_guests = ?, highlights = ?, display_order = ? WHERE id = ?`,
    [name, description, price, image_url, max_guests, highlights, display_order, id],
    (err) => {
      if (err) return res.status(500).json({ error: "Update failed" });
      res.json({ message: "Package updated successfully" });
    }
  );
});

router.delete("/:id", requireAdmin, (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM banquet_packages WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: "Delete failed" });
    res.json({ message: "Package deleted successfully" });
  });
});

module.exports = router;
