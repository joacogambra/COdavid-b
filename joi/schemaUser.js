const joi = require("joi");

const schema = joi.object({
  mail: joi
    .string()
    .required()
    .min(3)
    .max(40)
    .email({ minDomainSegments: 2 })
    .messages({
      "string.empty": "El correo electrónico no puede estar vacío",
      "string.email": "El correo electrónico no es válido",
      "any.required": "El correo electrónico es obligatorio",
    }),
  name: joi.string().required().min(3).max(40).messages({
    "string.empty": "El nombre no puede estar vacío",
    "any.required": "El nombre es obligatorio",
  }),
  age: joi.number().required().min(18).max(100).messages({
    "number.base": "La edad debe ser un número",
    "number.empty": "La edad no puede estar vacía",
    "any.required": "La edad es obligatoria",
  }),
  country: joi.string().required().min(3).max(30).messages({
    "string.empty": "El país no puede estar vacío",
    "any.required": "El país es obligatorio",
  }),
  contraseña: joi.string().required().min(6).max(40).messages({
    "string.empty": "La contraseña no puede estar vacía",
    "string.min": "La contraseña debe tener al menos {#limit} caracteres",
    "any.required": "La contraseña es obligatoria",
  }),
  codigo: joi.any(),
});

module.exports = schema;