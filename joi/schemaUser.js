const joi = require('joi')

const schema = joi.object({
    mail:joi.string().required().min(3).max(40).email({minDomainSegments:2}),
    name:joi.string().required().min(3).max(40),
    age:joi.number().required().min(18).max(100),
    country:joi.string().required().min(3).max(30),
    contraseña:joi.string().required(),
    codigo:joi.any()
})

module.exports = schema