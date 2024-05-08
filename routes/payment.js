const router = require("express").Router();
const {
  createOrder,
  captureOrder,
  cancelPayment,
  createSession,
  webhookController,
} = require("../controllers/payment");
const { mustSignIn } = require("../middlewares/mustSignIn");
const passport = require("../config/passport");


router.post("/create-order", createOrder);

router.post(
  "/create-checkout-session",
  passport.authenticate("jwt", { session: false }),
  createSession,
);

router.post("/capture-order", captureOrder);

router.get("/cancel-order", cancelPayment);



module.exports = router;
