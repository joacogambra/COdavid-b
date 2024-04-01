const Joi = require("joi");

const signinSchema = Joi.object({
  mail: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

module.exports = { signinSchema };
