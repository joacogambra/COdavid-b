const Courses = require("../models/Courses");

async function verificarCurso(req, res, next) {
  const cursoId = req.body.cursoId;
  const amountPaid = req.body.amountPaid;
  console.log("cursoId", cursoId, 'amountPaid', amountPaid);
  try {
    const course = await Courses.findById(cursoId);
    if (!course) {
      return res.status(404).json({ error: "El curso especificado no existe." });
    }
    if (course.precio !== amountPaid) {
      return res
        .status(400)
        .json({ error: "El precio del curso no coincide con el precio solicitado." });
    }

    next();
  } catch (error) {
    console.error("Error al verificar el curso:", error);
    res
      .status(500)
      .json({ error: "Error interno del servidor al verificar el curso." });
  }
}

module.exports = verificarCurso;
