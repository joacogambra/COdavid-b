const User = require("../models/User");
const { userExistsResponse } = require("../config/responses");

async function accountExists(req, res, next) {
       const existingUser = await User.findOne({ mail: req.body.mail });
       if (existingUser) {
         return res.status(400).json({
           success: false,
           message: "El email ya está registrado.",
         });
       }
    return next()
}

module.exports = { accountExists }
