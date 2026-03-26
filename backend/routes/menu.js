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

function featuredFlag(v) {
  return v === true || v === 1 || v === "1" ? 1 : 0;
}

router.get("/", (req, res) => {
  db.query(
    "SELECT * FROM menu_items ORDER BY display_order ASC, id ASC",
    (err, results) => {
      if (err) return res.status(500).json({ error: "Fetch failed" });
      res.json(results);
    }
  );
});

router.post("/", requireAdmin, (req, res) => {
  const { name, description, price, category } = req.body;
  if (!name || !description || price === undefined || price === null || !category) {
    console.error("Validation Error: Missing fields in POST /api/menu", req.body);
    return res.status(400).json({ error: "All fields required" });
  }

  const image_url = optionalString(req.body.image_url);
  const dietary_note = optionalString(req.body.dietary_note);
  const is_featured = featuredFlag(req.body.is_featured);
  const display_order = displayOrder(req.body.display_order);

  db.query(
    `INSERT INTO menu_items (name, description, price, category, image_url, dietary_note, is_featured, display_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, description, price, category, image_url, dietary_note, is_featured, display_order],
    (err, result) => {
      if (err) {
        console.error("Database Insert Error:", err);
        return res
          .status(500)
          .json({ error: "Insert failed", details: err.message });
      }
      res.json({ message: "Menu item added successfully", id: result.insertId });
    }
  );
});

router.put("/:id", requireAdmin, (req, res) => {
  const { id } = req.params;
  const { name, description, price, category } = req.body;
  const image_url = optionalString(req.body.image_url);
  const dietary_note = optionalString(req.body.dietary_note);
  const is_featured = featuredFlag(req.body.is_featured);
  const display_order = displayOrder(req.body.display_order);

  db.query(
    `UPDATE menu_items SET name = ?, description = ?, price = ?, category = ?,
     image_url = ?, dietary_note = ?, is_featured = ?, display_order = ? WHERE id = ?`,
    [name, description, price, category, image_url, dietary_note, is_featured, display_order, id],
    (err) => {
      if (err) {
        console.error("Database Update Error:", err);
        return res
          .status(500)
          .json({ error: "Update failed", details: err.message });
      }
      res.json({ message: "Menu item updated successfully" });
    }
  );
});

router.delete("/:id", requireAdmin, (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM menu_items WHERE id = ?", [id], (err) => {
    if (err) {
      console.error("Database Delete Error:", err);
      return res
        .status(500)
        .json({ error: "Delete failed", details: err.message });
    }
    res.json({ message: "Menu item deleted successfully" });
  });
});

module.exports = router;
