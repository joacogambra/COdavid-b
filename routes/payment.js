const router = require("express").Router();
const { createOrder, captureOrder, cancelPayment } = require("../controllers/payment");
const { SESSION_SECRET } = process.env;

router.post("/create-order", createOrder);

router.post("/capture-order", captureOrder);

router.get("/cancel-order", cancelPayment);

module.exports = router;
