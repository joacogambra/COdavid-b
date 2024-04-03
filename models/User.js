const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  mail: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  age: { type: Number, required: true },
  country: { type: String, required: true },
  contraseña: { type: String, required: true },
  codigo: { type: String, required: true },
  verified: { type: Boolean, required: true },
  logged: { type: Boolean, required: true },
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "courses",
    },
  ],
});

const User = mongoose.model('users', schema)
module.exports = User