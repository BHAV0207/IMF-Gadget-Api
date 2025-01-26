const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

const authenticate = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token)
    return res.status(401).json({ error: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.gadgetId !== req.params.id) {
      return res
        .status(403)
        .json({ error: "Access denied. Invalid token for this gadget." });
    }

    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token." });
  }
};

module.exports = authenticate;
