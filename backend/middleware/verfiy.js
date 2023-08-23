const jwt = require("jsonwebtoken");
jwtSec = "pass";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (!authHeader) {
    return res.status(500).json("token not found");
  }
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, jwtSec, (err, user) => {
      if (err) {
        res.status(500).json("token is not valid");
      } else {
        req.userDetails = user;
        console.log(user, "dddddddd");

        next();
      }
    });
  }
};

module.exports = { verifyToken };
