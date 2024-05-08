const { CLIENT, SECRET, PAYPAL_URL } = process.env;
const auth = { user: CLIENT, pass: SECRET };
const cors = require("cors");
let router = require("express").Router();
const express = require("express");
const insertarCompra = require("../controllers/purchase");
const { validarUserId } = require("../middlewares/isUserId");
const verifyCourse = require("../middlewares/verifyCourse");
const mustSignIn = require("../middlewares/mustSignIn");
const accountExistsSignIn = require("../middlewares/accountExistsSignIn");
const { getAllCourses } = require("../controllers/courses");
const passport = require("../config/passport");

router.post(
  "/init-payment",
  passport.authenticate("jwt", { session: false }),  
  mustSignIn,
  async (req, res) => {
    console.log('req',req.user)
    const userId = req.user.id;
    const { courseId, amountPaid } = req.body;
    
    try {
      await insertarCompra(userId, courseId, amountPaid);
      res.status(201).json({ message: "Compra realizada exitosamente." });
    } catch (error) {
      console.error("Error al realizar la compra:", error);
      res.status(500).json({ error: "Error al realizar la compra." });
    }
   
  },
);

router.get("/courses", getAllCourses);

module.exports = router;

// router.get(
//   "/courses",
//   passport.authenticate("jwt", { session: false, failWithError: true }),
//   getAllCourses,
//   (err, req, res, next) => {
//     if (err) {
//       getAllCourses(req, res);
//     }
//   },
// );