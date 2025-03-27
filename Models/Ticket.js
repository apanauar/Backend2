const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [{ name: String, price: Number, quantity: Number }],
  total: { type: Number, required: true },
  status: { type: String, enum: ["pendiente", "pagado"], default: "pendiente" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Ticket", ticketSchema);
