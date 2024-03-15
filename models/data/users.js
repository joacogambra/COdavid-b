require("dotenv").config();
require("../../config/database");

const User = require("../User");

users.forEach((e) => {
  User.create({
    mail: e.mail,
    name: e.name,
    age: e.age,
    country: e.country,
    contraseña:e.contraseña,
    codigo: e.codigo,
  });
});
