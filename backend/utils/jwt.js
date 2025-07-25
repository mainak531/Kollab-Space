const jwt = require("jsonwebtoken");
const TOKEN_SECRET = process.env.TOKEN_SECRET || "secret123";

const verifyUserWithToken = async (token, name) => {
  const decoded = await jwt.verify(token, TOKEN_SECRET);
  return decoded.name === name;
};

module.exports = { verifyUserWithToken };
