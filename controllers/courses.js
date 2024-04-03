// controllers/courseController.js
const Course = require("../models/Courses");
const Purchase = require("../models/Purchase");	
// const controller = {
//   getAllCourses: async (req, res) => {
//     console.log("getAllCourses");
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
};
module.exports = controller;
