const express = require("express");
const db = require("../database");
const requireAdmin = require("../middleware/requireAdmin");
const {
  sendPendingEmail,
  sendConfirmEmail,
  sendRejectEmail,
} = require("../utils/email");

const router = express.Router();

router.post("/", (req, res) => {
  const { name, email, contact, room, checkin, checkout, people } = req.body;

  const checkQuery = `
    SELECT * FROM bookings 
    WHERE room = ? 
    AND status != 'rejected'
    AND (
      (? <= checkout) AND (? >= checkin)
    )
  `;

  db.query(checkQuery, [room, checkin, checkout], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (results.length > 0) {
      return res.status(400).json({
        message: "This room is already booked",
      });
    }

    db.query(
      "CALL add_booking(?, ?, ?, ?, ?, ?, ?)",
      [name, email, contact, room, checkin, checkout, people],
      async (err) => {
        if (err) return res.status(500).json({ error: "Insert failed" });

        try {
          await sendPendingEmail(email, name, room, checkin, checkout);
          console.log("Pending email sent");
        } catch (e) {
          console.log("Email error:", e);
        }

        res.json({ message: "Booking created" });
      }
    );
  });
});

router.get("/", requireAdmin, (req, res) => {
  db.query("CALL get_all_bookings()", (err, result) => {
    if (err) return res.status(500).json({ error: "Fetch failed" });
    res.json(result[0]);
  });
});

router.put("/:id", requireAdmin, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  console.log("STATUS RECEIVED:", status);

  db.query("SELECT * FROM bookings WHERE id = ?", [id], (err, results) => {
    if (err || results.length === 0) {
      return res.status(500).json({ error: "Booking not found" });
    }

    const booking = results[0];

    db.query(
      "CALL update_booking_status(?, ?)",
      [id, status],
      async (err) => {
        if (err) return res.status(500).json({ error: "Update failed" });

        try {
          if (status.toLowerCase() === "accepted") {
            console.log("Sending CONFIRM email...");
            await sendConfirmEmail(booking);
          } else if (status.toLowerCase() === "rejected") {
            console.log("Sending REJECT email...");
            await sendRejectEmail(booking.email, booking.name);
          }
        } catch (e) {
          console.log("Email error:", e);
        }

        res.json({ message: "Updated + email sent" });
      }
    );
  });
});

module.exports = router;
