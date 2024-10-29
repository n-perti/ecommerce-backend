const { verifyToken } = require("../config/jwt");
const User = require("../models/nosql/users");
const Commerce = require("../models/nosql/commerce");

const commerceMiddleware = async (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res
      .status(401)
      .send({ error: "Authorization header missing or malformed." });
  }

  try {
    const decoded = verifyToken(authHeader);
    const commerce = await Commerce.findOne({ cif: decoded.cif });
    console.log(!commerce);
    if (!commerce) {
      return res
        .status(401)
        .send({ error: "Invalid token or commerce not found." });
    }

    req.commerce = commerce;
    req.token = authHeader;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate." });
  }
};
const authMiddleware = async (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).send("Access Denied");

  try {
    const tokenWithoutBearer = token.startsWith("Bearer ")
      ? token.slice(7, token.length)
      : token;
    const verified = verifyToken(tokenWithoutBearer);
    const user = await User.findById(verified.id);
    if (!user) return res.status(404).send("User not found");

    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") return res.status(403).send("Access Denied");
  next();
};

module.exports = { authMiddleware, adminMiddleware, commerceMiddleware };
