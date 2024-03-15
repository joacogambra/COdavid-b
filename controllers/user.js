const User = require('../models/User')
const bcryptjs = require('bcryptjs')
const crypto = require('crypto')
const accountVerificationEmail = require('./accountVerificationEmail')
const {userSignedUpResponse, userNotFoundResponse} = require('../config/responses')

const controller = {
    registrar: async (req, res, next) => {
        let {mail,name,age, country,contraseña} = req.body
        let verified = false
        let codigo = crypto.randomBytes(16).toString('hex')
        contraseña = bcryptjs.hashSync(contraseña, 10)
        try {
            await User.create({mail,name,age, country,contraseña, codigo, verified})
            await accountVerificationEmail(mail,codigo)
            return userSignedUpResponse(req,res)
        } catch(error) {
            next(error)
        }
    },
    verificar: async(req,res,next) => {
        const { code } = req.params
        try {
            let user = await User.findOneAndUpdate({ codigo: code }, { verified: true }, { new: true })
            if (user) {
                return res.redirect('https://github.com/joacogambra')
            }
            return userNotFoundResponse(req, res)
        } catch (error) {
            next(error)
        }
    },

}

module.exports = controller