const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["x-token"];
  if (!authHeader) {
    return res.status(401).send("Incorrect token information.");
  } else {
    try {
      jwt.verify(authHeader, process.env.SECRET_KEY, (err, user) => {
        if (err) {
          return res.status(403).send(err);
        } else {
          req.user = user;
          next();
        }
      });
    } catch (ex) {
      return res.status(500).send(ex);
    }
  }
}

module.exports = authenticateToken;
