let router = require("express").Router();
let schema = require("../joi/schemaUser");
let validator = require("../middlewares/validator");
const { accountExists } = require("../middlewares/accountExistsSignUp");
const {
  accountExists: accountExistsSignIn,
} = require("../middlewares/accountExistsSignIn");
const mustSignIn  = require("../middlewares/mustSignIn");
let {
  registrar,
  verificar,
  signIn,
  signInWithToken,
  exit,
} = require("../controllers/user");

let { signinSchema } = require("../joi/schemaSignin");
const { accountHasBeenVerified } = require("../middlewares/accountHasBeenVerified");
const passport = require("../config/passport");

router.post("/signup", validator(schema), accountExists, registrar);
router.post(
  "/signin",
  validator(signinSchema),
  accountExistsSignIn,
  accountHasBeenVerified,
  signIn,
);
router.post("/signout", passport.authenticate("jwt", { session: false }), exit);
router.post(
  "/token",
  passport.authenticate("jwt", { session: false }),
  mustSignIn,
  signInWithToken,
);
router.get("/verify/:code", verificar);

module.exports = router;
