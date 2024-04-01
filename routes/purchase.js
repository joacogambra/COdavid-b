const { CLIENT, SECRET, PAYPAL_URL } = process.env;
const auth = { user: CLIENT, pass: SECRET };
const cors = require("cors");
let router = require("express").Router();
const express = require("express");
const insertarCompra = require("../controllers/purchase");
const { validarUserId } = require("../middlewares/isUserId");
const verifyCourse = require("../middlewares/verifyCourse");
const mustSignIn = require("../middlewares/mustSignIn");
router.post("/", mustSignIn, validarUserId, verifyCourse, async (req, res) => {
  const { userId, courseId, amountPaid } = req.body;

  try {
    await insertarCompra(userId, courseId, amountPaid);
    res.status(201).json({ message: "Compra realizada exitosamente." });
  } catch (error) {
    console.error("Error al realizar la compra:", error);
    res.status(500).json({ error: "Error al realizar la compra." });
  }
});

module.exports = router;
