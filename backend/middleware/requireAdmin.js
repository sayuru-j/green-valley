const jwt = require("jsonwebtoken");
const config = require("../config");

function requireAdmin(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, config.jwtSecret);
    req.admin = {
      id: payload.sub,
      username: payload.username,
    };
    next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

module.exports = requireAdmin;
