// const mongoose = require('mongoose');

// const appointmentSchema = new mongoose.Schema({
//   patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   date: { type: Date, required: true },
//   status: { type: String, enum: ['scheduled', 'completed', 'canceled'], default: 'scheduled' },
// });

// module.exports = mongoose.model('Appointment', appointmentSchema);


const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  appointmentDate: { type: Date, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'canceled'], default: 'pending' },
  appointmentType: { type: String, enum: ['physical', 'virtual'], required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  notes: { type: String },
});

module.exports = mongoose.model('Appointment', appointmentSchema);
