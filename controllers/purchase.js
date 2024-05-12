const mongoose = require("mongoose");

async function insertarCompra(userId, courseId, amountPaid) {
  // if (!userId || !courseId || amountPaid == null) {
  //   throw new Error("Error al procesar la compra: faltan datos.");
  // }
  try {
    const comprasCollection = mongoose.connection.collection("purchases");

    const nuevaCompra = {
      user_id: userId,
      course_id: courseId,
      purchase_date: new Date(),
      amount_paid: amountPaid,
    };

    const result = await comprasCollection.insertOne(nuevaCompra);
  } catch (error) {
    console.error("Error al insertar compra:", error);
    throw error;
  }
}

module.exports = insertarCompra;
