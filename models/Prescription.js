const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  quantity: { type: Number, required: true },
  instructions: { type: String },  // Instructions for each medication
});

const prescriptionSchema = new mongoose.Schema({
  prescriptionNumber: { type: String, required: true, unique: true },  // Unique identifier for each prescription
  // patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patientName: { type: String},
  patientEmail: { type: String, required: true },
  // doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorName: { type: String, required: true },
  medications: [medicationSchema],  // Array of medications
  diagnosis: { type: String, required: true },  // Diagnosis for the prescription
  instructions: { type: String },  // Any special instructions for the patient
  startDate: { type: Date, required: true },  // Start date for the medication
  endDate: { type: Date, required: true },  // End date for the medication
  refills: { type: Number, default: 0 },  // Number of refills allowed
  pharmacy: { type: String },  // Pharmacy where the prescription can be filled
  doctorNotes: { type: String },  // Additional notes from the doctor
  status: { type: String, enum: ['active', 'expired', 'completed'], default: 'active' },  // Status of the prescription
  date: { type: Date, default: Date.now },  // Date when the prescription was created
});

module.exports = mongoose.model('Prescription', prescriptionSchema);
