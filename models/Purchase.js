const mongoose = require("mongoose");
const { Schema } = mongoose;

const purchaseSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  course_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Course",
  },
  purchase_date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  amount_paid: {
    type: Number,
    required: true,
  },
});

const Purchase = mongoose.model("Purchase", purchaseSchema);
module.exports = Purchase;