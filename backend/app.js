const express = require("express");
const cors = require("cors");
const config = require("./config");

const app = express();

if (config.corsOrigin) {
  app.use(cors({ origin: config.corsOrigin, credentials: true }));
} else {
  app.use(cors());
}
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.use("/api/bookings", require("./routes/bookings"));
app.use("/api/contact", require("./routes/contact"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/banquet-packages", require("./routes/banquet"));
app.use("/api/rooms", require("./routes/rooms"));
app.use("/api/menu", require("./routes/menu"));
app.use("/api/reviews", require("./routes/reviews"));

module.exports = app;
