const express = require('express');
const Prescription = require('../models/Prescription');
const Appointment = require('../models/Appointment');
const authenticateJWT = require('../middleware/authMiddleware');
const User = require('../models/User');
const Medicine = require('../models/Medicines'); // Import Medicine model
const Doctor = require('../models/Doctor'); // Import the schema

const router = express.Router();

router.post('/add-prescription', authenticateJWT, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).send({ message: 'Admin access required' });
  
    const { patientEmail, doctorName, medications, diagnosis, instructions, startDate, endDate, refills, pharmacy, doctorNotes } = req.body;
    console.log("Request Body:", req.body.patientEmail); 
    //  const patient = await User.findOne({ email: patientEmail });
    //     if (!patient) {
    //         return res.status(404).json({ message: 'Patient not found' });
    //     }

    if (!patientEmail) {
      return res.status(400).json({ message: "Patient email is required" });
  }

  try {
      const patient = await User.findOne({ email: patientEmail });
      if (!patient) {
          return res.status(404).json({ message: 'Patient not found' });
      }

      const prescription = new Prescription({
          prescriptionNumber: `RX${Date.now()}`, // Unique identifier
          patientName: patient.name, // Fetch from database
          patientEmail,
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
      res.status(201).send({message:"Prescription submitted successfully!" ,prescriptionData: prescription});
  } catch (error) {
      console.error("Error saving prescription:", error);
      res.status(500).json({ message: "Internal Server Error", error });
  }
  
  });
  

// View all appointments (Admin only)
// router.get('/appointments', authenticateJWT, async (req, res) => {
//   if (req.user.role !== 'admin') return res.status(403).send({ message: 'Admin access required' });

//   const appointments = await Appointment.find().populate('patient doctor');
//   res.send(appointments);
// });


router.get('/appointments', authenticateJWT, async (req, res) => {
    if (req.user.role !== 'admin') {
      return res.status(403).send({ message: 'Admin access required' });
    }
  
    try {
      const appointments = await Appointment.find()
        .populate({
          path: 'patientId', // This should match the field in the Appointment schema
          select: 'name'   // Fetch only the name from Users table
        })
        .populate({
          path: 'doctorId',   // This should match the field in the Appointment schema
          select: 'name'    // Fetch only the name from Doctors table
        });
  
      res.send(appointments);
    } catch (error) {
      res.status(500).send({ message: 'Internal Server Error', error });
    }
  });
  

// Get all medications based on diagnosis
router.get('/medications-by-diagnosis', authenticateJWT, async (req, res) => {
    const { diagnosis } = req.query;  

    if (!diagnosis) {
        return res.status(400).send({ message: 'Diagnosis is required' });
    }

    try {
        // Find medicines related to the given diagnosis
        const medications = await Medicine.find({ diagnosis: new RegExp(diagnosis, 'i') });

        if (medications.length === 0) {
            return res.status(404).send({ message: 'No medications found for the given diagnosis' });
        }

        res.status(200).send(medications);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error fetching medications' });
    }
});

router.post('/add-medicine', async (req, res) => {
  try {
      const medicines = req.body; // Expecting an array of medicine objects
      await Medicine.insertMany(medicines);
      res.status(201).send({ message: "Medicines added successfully" });
  } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error adding medicines" });
  }
});


// Add a new doctor
router.post('/add-doctor', async (req, res) => {
    const { name, specialty, email, phone, experience, availableDays, availableTime, clinicAddress } = req.body;

    try {
        const newDoctor = new Doctor({
            name,
            specialty,
            email,
            phone,
            experience,
            availableDays,
            availableTime,
            clinicAddress
        });

        await newDoctor.save();
        res.status(201).json({ message: "Doctor added successfully", doctor: newDoctor });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding doctor" });
    }
});

module.exports = router;
