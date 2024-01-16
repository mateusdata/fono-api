const jwt = require("jsonwebtoken");


const middlewareUser = (req, res, next) => {
  const tokenHeader = req.header("Authorization");

  if (!tokenHeader) {
    res.status(403).send("Access Unauthorized");
  }

  const token = tokenHeader.split(" ")[1];

  try {

    jwt.verify(token, process.env.secretKey, (err, decode) => {
      
      if (err) {
        return res.status(401).json({ message: "Token is invalid or expired" });
      }

      req.id_token = decode.id_token;
      next();

    });

  } catch {

    res.status(500).json({ message: "Internal erorr", token });

  }
};

module.exports = middlewareUser;
