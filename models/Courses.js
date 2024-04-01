// models/Curso.js

const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
  precio: {
    type: Number,
    required: true,
  },
  gratuito: {
    type: Boolean,
    default: false,
  },
  videos: [
    {
      titulo: String,
      url: String,
    },
  ],
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
