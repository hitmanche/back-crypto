const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["x-token"];
  if (!authHeader) return res.status(401).send("Hatalı token bilgisi");

  try {
    jwt.verify(authHeader, process.env.SECRET_KEY, (err, user) => {
      console.log(err);
      if (err) return res.status(403).send(err);

      req.user = user;
      next();
    });
  } catch (ex) {
    console.log(ex);
    res.status(500).send(ex);
  }
}

module.exports = authenticateToken;
