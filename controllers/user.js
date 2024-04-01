const User = require("../models/User");
const bcryptjs = require("bcryptjs");
const crypto = require("crypto");
const accountVerificationEmail = require("./accountVerificationEmail");
const {
  userSignedUpResponse,
  userNotFoundResponse,
  invalidCredentialsResponse,
  userSignedOutResponse,
} = require("../config/responses");
const jwt = require("jsonwebtoken");

const controller = {
  registrar: async (req, res, next) => {
    let { mail, name, age, country, contraseña } = req.body;
    let verified = false;
    let codigo = crypto.randomBytes(16).toString("hex");
    contraseña = bcryptjs.hashSync(contraseña, 10);
    try {
      await User.create({ mail, name, age, country, contraseña, codigo, verified });
      await accountVerificationEmail(mail, codigo);
      return userSignedUpResponse(req, res);
    } catch (error) {
      next(error);
    }
  },
  verificar: async (req, res, next) => {
    const { code } = req.params;
    try {
      let user = await User.findOneAndUpdate(
        { codigo: code },
        { verified: true },
        { new: true },
      );
      if (user) {
        return res.redirect("https://github.com/joacogambra");
      }
      return userNotFoundResponse(req, res);
    } catch (error) {
      next(error);
    }
  },
  signIn: async (req, res, next) => {
    const { password } = req.body;
    const { user } = req;
    try {
      const verifypassword = bcryptjs.compareSync(password, user.contraseña);

      if (verifypassword) {
        const userDataBase = await User.findOneAndUpdate(
          { _id: user.id },
          { logged: true },
          { new: true },
        );
        const token = jwt.sign(
          {
            id: userDataBase._id,
            name: userDataBase.name,
            logged: userDataBase.logged,
            role: userDataBase.role,
          },
          process.env.KEY_JWT,
          { expiresIn: 60 * 60 * 24 },
        );
        return res.status(200).json({
          response: { user, token },
          success: true,
          message: "Welcome! You have successfully signed " + user.name,
        });
      }
      return invalidCredentialsResponse(req, res);
    } catch (error) {
      console.log("error", error);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },
  signInWithToken: async (req, res, next) => {
    
    let { user } = req;
    try {
      return res.json({
        response: { user },
        success: true,
        message: "Welcome " + user.name,
      });
    } catch (error) {
      next(error); 
    }
  },
  exit: async (req, res, next) => {
    const { id } = req.user;
    try {
      await User.findByIdAndUpdate(id, { logged: false });
      return userSignedOutResponse(req, res);
    } catch (error) {
      errorMessage(res, 400, error.message);
    }
  },
};

module.exports = controller;
