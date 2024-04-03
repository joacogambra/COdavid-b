// controllers/courseController.js
const Course = require("../models/Courses");
const controller ={
  getAllCourses: async (req, res) => {
    console.log("getAllCourses");
    try {
      const courses = await Course.find();
      res.json(courses);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};
module.exports = controller;


