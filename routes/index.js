let router = require("express").Router();

let user = require("./user");
let purchase = require("./purchase");
let payment = require("./payment");
router.use("/user", user);

router.use("/auth", user);
router.use("/purchase", purchase);
router.use("/payment", payment);
module.exports = router;
