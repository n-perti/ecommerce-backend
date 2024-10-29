const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET || "your_jwt_secret";

const generateToken = (payload) =>
  jwt.sign(payload, secret, { expiresIn: "2h" });
const verifyToken = (token) => jwt.verify(token, secret);

module.exports = { generateToken, verifyToken };
