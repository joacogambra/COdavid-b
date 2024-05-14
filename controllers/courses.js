// controllers/courseController.js
const { get } = require("mongoose");
const Course = require("../models/Courses");
const Purchase = require("../models/Purchase");	
// const controller = {
//   getAllCourses: async (req, res) => {
//     try {
//       const courses = await Course.find();
//       res.json(courses);
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   },
// };

const controller = {
  getAllCourses: async (req, res) => {
    try {
      const allCourses = await Course.find();
      if (req.user) {
        const purchases = await Purchase.find({ user_id: req.user.id });
        const purchasedCourseIds = purchases.map((purchase) =>
          purchase.course_id.toString(),
        );

        const coursesWithPurchaseStatus = allCourses.map((course) => ({
          ...course._doc,
          needsToBePurchased: !purchasedCourseIds.includes(course._id.toString()),
        }));

        return res.json(coursesWithPurchaseStatus);
      } else {
        const coursesToBuy = allCourses.map((course) => ({
          ...course._doc,
          needsToBePurchased: true,
        }));
        return res.json(coursesToBuy);
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Ocurrió un error al obtener los cursos." });
    }
  },
  getCourseById: async (req, res) => {
    try {
       const { courseId } = req.body;
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: "Curso no encontrado." });
      }
      return res.json(course);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Ocurrió un error al obtener el curso." });
    }
  },
};
module.exports = controller;
