const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    specialty: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    experience: { type: Number, required: true }, // Years of experience
    availableDays: { type: [String], required: true }, // ["Monday", "Wednesday", "Friday"]
    availableTime: { type: String, required: true }, // "10:00 AM - 5:00 PM"
    clinicAddress: { type: String, required: true }
});

const Doctor = mongoose.model('Doctor', doctorSchema);
module.exports = Doctor;
