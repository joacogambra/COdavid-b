const router = require("express").Router();
const {
  createOrder,
  captureOrder,
  cancelPayment,
  createSession,
  webhookController,
} = require("../controllers/payment");

router.post("/create-order", createOrder);

router.post("/create-checkout-session", createSession);

router.post("/capture-order", captureOrder);

router.get("/cancel-order", cancelPayment);

router.post('/webhook',webhookController)

module.exports = router;
