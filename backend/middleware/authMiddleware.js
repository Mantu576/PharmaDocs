const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(403).json({ msg: "No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Remove "Bearer"
  if (!token) {
    return res.status(403).json({ msg: "Token format invalid" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ msg: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
};
