const { mustSignInResponse } = require("../config/responses");

function mustSignIn(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: "Usuario no autenticado." });
  }
  next();
}

module.exports = mustSignIn;
