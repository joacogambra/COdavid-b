const router = require("express").Router();
const { createOrder, captureOrder, cancelPayment } = require("../controllers/payment");

router.get("/create-order", createOrder);

router.get("/capture-order", captureOrder);

router.get("/cancel-order", cancelPayment);

module.exports = router;

