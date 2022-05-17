const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;

module.exports = {
  generateToken: (user) => {
    return jwt.sign(user, SECRET, {
      expiresIn: "1200s",
    });
  },

  verifyToken: (token) => {
    try {
      jwt.verify(token, SECRET);
      return true;
    } catch (e) {
      return false;
    }
  },
};
