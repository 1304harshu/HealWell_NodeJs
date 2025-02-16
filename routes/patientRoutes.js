const express = require('express');
const Prescription = require('../models/Prescription');
const Appointment = require('../models/Appointment');
const authenticateJWT = require('../middleware/authMiddleware');

const router = express.Router();

// View prescriptions for the logged-in patient
router.get('/prescriptions', authenticateJWT, async (req, res) => {
  if (req.user.role !== 'patient') return res.status(403).send({ message: 'Patient access required' });

  const prescriptions = await Prescription.find({ patient: req.user._id }).populate('doctor');
  res.send(prescriptions);
});

// Schedule an appointment
// router.post('/schedule-appointment', authenticateJWT, async (req, res) => {
//   if (req.user.role !== 'patient') return res.status(403).send({ message: 'Patient access required' });

//   const { doctorId, date } = req.body;

//   const appointment = new Appointment({
//     patient: req.user._id,
//     doctor: doctorId,
//     date,
//   });

//   await appointment.save();
//   res.status(201).send(appointment);
// });

// Route to schedule an appointment
router.post('/schedule-appointment', authenticateJWT, async (req, res) => {
    const { patientId, doctorId, appointmentDate, reason, appointmentType, notes } = req.body;
  
    // Create a new appointment object
    const appointment = new Appointment({
      patientId,
      doctorId,
      appointmentDate,
      reason,
      appointmentType,
      notes,
    });
  
    try {
      const savedAppointment = await appointment.save();
      res.status(201).send({
        appointmentId: savedAppointment._id,
        message: 'Appointment scheduled successfully, waiting for confirmation.',
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Error scheduling appointment' });
    }
  });

// Get all medications based on diagnosis
// router.get('/medications-by-diagnosis', authenticateJWT, async (req, res) => {
//     const { diagnosis } = req.query;  // Diagnosis is passed as a query parameter
  
//     if (!diagnosis) {
//       return res.status(400).send({ message: 'Diagnosis is required' });
//     }
  
//     try {
//       // Find prescriptions with the given diagnosis
//       const prescriptions = await Prescription.find({ diagnosis: new RegExp(diagnosis, 'i') });  // Case-insensitive search
  
//       // Create an array to store the list of medications
//       const medications = prescriptions.flatMap(prescription =>
//         prescription.medications.map(med => ({
//           name: med.name,
//           dosage: med.dosage,
//           quantity: med.quantity,
//           instructions: med.instructions,
//           diagnosis: prescription.diagnosis,
//         }))
//       );
  
//       if (medications.length === 0) {
//         return res.status(404).send({ message: 'No medications found for the given diagnosis' });
//       }
  
//       res.status(200).send(medications);
//     } catch (error) {
//       console.error(error);
//       res.status(500).send({ message: 'Error fetching medications' });
//     }
//   });

module.exports = router;
