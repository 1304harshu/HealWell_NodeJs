const express = require('express');
const Prescription = require('../models/Prescription');
const Appointment = require('../models/Appointment');
const authenticateJWT = require('../middleware/authMiddleware');
const User = require('../models/User');
const Medicine = require('../models/Medicines'); // Import Medicine model
const Doctor = require('../models/Doctor'); // Import the schema

const router = express.Router();

// View prescriptions for the logged-in patient
router.get('/prescriptions', authenticateJWT, async (req, res) => {
  try {
    // Check if the user is a patient
    if (req.user.role !== 'patient') {
      return res.status(403).send({ message: 'Patient access required' });
    }

    // Fetch prescriptions for the logged-in patient
    const prescriptions = await Prescription.find({ patientEmail: req.user.email });

    // Send response
    res.send({ data: prescriptions });
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});


router.get('/prescriptions/:prescriptionNo', authenticateJWT, async (req, res) => {
  try {
    // Check if the user is a patient
    if (req.user.role !== 'patient') {
      return res.status(403).send({ message: 'Patient access required' });
    }

    // Extract prescription number from request parameters
    const { prescriptionNo } = req.params;

    // Find the prescription by its number and patient email
    const prescription = await Prescription.findOne({ prescriptionNo, patientEmail: req.user.email });

    // Check if prescription exists
    if (!prescription) {
      return res.status(404).send({ message: 'Prescription not found' });
    }

    // Send response
    res.send({ data: prescription });
  } catch (error) {
    console.error('Error fetching prescription:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
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

  router.get('/doctors', async (req, res) => {
    try {
        const doctors = await Doctor.find({});
        res.status(200).json(doctors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching doctors' });
    }
});


module.exports = router;
