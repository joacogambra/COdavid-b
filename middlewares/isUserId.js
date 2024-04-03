const User = require("../models/User");

const validarUserId = async (req, res, next) => {
  const userId = req.user.id;
  
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: "El userId proporcionado no es válido." });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Error al validar userId:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

module.exports = { validarUserId };
