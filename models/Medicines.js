const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  quantity: { type: Number, required: true },
  instructions: { type: String },
  diagnosis: { type: String, required: true } // Link to diagnosis
});

const Medicine = mongoose.model('Medicine', medicineSchema);
module.exports = Medicine;
