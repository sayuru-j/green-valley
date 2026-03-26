const express = require("express");
const { sendContactEmail } = require("../utils/email");

const router = express.Router();

router.post("/", (req, res) => {
  const { name, email, subject, message } = req.body;

  sendContactEmail(name, email, subject, message)
    .then(() => res.json({ message: "Sent" }))
    .catch(() => res.status(500).json({ message: "Email failed" }));
});

module.exports = router;
