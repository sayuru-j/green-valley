const express = require("express");
const db = require("../database");
const requireAdmin = require("../middleware/requireAdmin");

const router = express.Router();

function numOrNull(v) {
  if (v === undefined || v === null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : null;
}

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

router.get("/", (req, res) => {
  db.query(
    "SELECT * FROM rooms ORDER BY display_order ASC, id ASC",
    (err, results) => {
      if (err) return res.status(500).json({ error: "Fetch failed" });
      res.json(results);
    }
  );
});

router.post("/", requireAdmin, (req, res) => {
  const { name, description, price } = req.body;

  if (!name || !description || price === undefined || price === null) {
    console.error("Validation Error: Missing fields in POST /api/rooms", req.body);
    return res
      .status(400)
      .json({ error: "All fields required", received: req.body });
  }

  const subtitle = optionalString(req.body.subtitle);
  const image_url = optionalString(req.body.image_url);
  const max_occupancy = numOrNull(req.body.max_occupancy);
  const display_order = displayOrder(req.body.display_order);

  db.query(
    `INSERT INTO rooms (name, description, price, subtitle, image_url, max_occupancy, display_order)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, description, price, subtitle, image_url, max_occupancy, display_order],
    (err, result) => {
      if (err) {
        console.error("Database Insert Error:", err);
        return res
          .status(500)
          .json({ error: "Insert failed", details: err.message });
      }
      res.json({ message: "Room added successfully", id: result.insertId });
    }
  );
});

router.put("/:id", requireAdmin, (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;
  const subtitle = optionalString(req.body.subtitle);
  const image_url = optionalString(req.body.image_url);
  const max_occupancy = numOrNull(req.body.max_occupancy);
  const display_order = displayOrder(req.body.display_order);

  db.query(
    `UPDATE rooms SET name = ?, description = ?, price = ?, subtitle = ?, image_url = ?,
     max_occupancy = ?, display_order = ? WHERE id = ?`,
    [name, description, price, subtitle, image_url, max_occupancy, display_order, id],
    (err) => {
      if (err) return res.status(500).json({ error: "Update failed" });
      res.json({ message: "Room updated successfully" });
    }
  );
});

router.delete("/:id", requireAdmin, (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM rooms WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: "Delete failed" });
    res.json({ message: "Room deleted successfully" });
  });
});

module.exports = router;
