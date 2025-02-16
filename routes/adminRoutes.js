const express = require('express');
const Prescription = require('../models/Prescription');
const Appointment = require('../models/Appointment');
const authenticateJWT = require('../middleware/authMiddleware');

const router = express.Router();

// Add a prescription (Admin only)
// router.post('/add-prescription', authenticateJWT, async (req, res) => {
//   if (req.user.role !== 'admin') return res.status(403).send({ message: 'Admin access required' });

//   const { patientId, doctorId, medications } = req.body;

//   const prescription = new Prescription({
//     patient: patientId,
//     doctor: doctorId,
//     medications,
//   });

//   await prescription.save();
//   res.status(201).send(prescription);
// });
router.post('/add-prescription', authenticateJWT, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).send({ message: 'Admin access required' });
  
    const { patientId, doctorId, medications, diagnosis, instructions, startDate, endDate, refills, pharmacy, doctorNotes } = req.body;
  
    const prescription = new Prescription({
      prescriptionNumber: `RX${Date.now()}`,  // Generate a unique prescription number
      patient: patientId,
      patientEmail,
      doctor: doctorId,
      doctorName,
      medications,
      diagnosis,
      instructions,
      startDate,
      endDate,
      refills,
      pharmacy,
      doctorNotes,
      status: 'active'
    });
  
    await prescription.save();
    res.status(201).send(prescription);
  });
  

// View all appointments (Admin only)
router.get('/appointments', authenticateJWT, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send({ message: 'Admin access required' });

  const appointments = await Appointment.find().populate('patient doctor');
  res.send(appointments);
});

module.exports = router;
