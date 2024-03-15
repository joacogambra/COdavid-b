const User = require("../models/User");
const { userExistsResponse } = require("../config/responses");

async function accountExists(req, res, next) {
    const user = await User.findOne({mail: req.body.mail})
    if (user) {
        userExistsResponse(req,res)
    }
    return next()
}

module.exports = { accountExists }
