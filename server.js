const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect('mongodb://localhost:27017/healwell', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Define Prescription Schema
const prescriptionSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  docterName: {type: String, required: true},
  address: { type: String },
  medicine1: { type: String },
  medicine2: { type: String },
  schedule: {
    morning: { type: Boolean, default: false },
    afternoon: { type: Boolean, default: false },
    night: { type: Boolean, default: false },
  },
});

// Prescription Model
const Prescription = mongoose.model('Prescription', prescriptionSchema);

// Routes
app.get('/', (req, res) => {
  res.send('HealWell API is running!');
});

// Create Prescription
app.post('/api/prescriptions', async (req, res) => {
  try {
    const { patientName, phoneNumber, docterName, address, medicine1, medicine2, schedule } = req.body;

    const newPrescription = new Prescription({
      patientName,
      phoneNumber,
      docterName,
      address,
      medicine1,
      medicine2,
      schedule,
    });

    await newPrescription.save();
    res.status(201).json({ message: 'Prescription added successfully', data: newPrescription });
  } catch (error) {
    res.status(500).json({ message: 'Error adding prescription', error });
  }
});

// Get All Prescriptions
app.get('/api/prescriptions', async (req, res) => {
  try {
    const prescriptions = await Prescription.find();
    res.status(200).json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching prescriptions', error });
  }
});

// Get Prescription by ID
app.get('/api/prescriptions/:id', async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    res.status(200).json(prescription);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching prescription', error });
  }
});

// Update Prescription
app.put('/api/prescriptions/:id', async (req, res) => {
  try {
    const { patientName, phoneNumber,docterName, address, medicine1, medicine2, schedule } = req.body;

    const updatedPrescription = await Prescription.findByIdAndUpdate(
      req.params.id,
      { patientName, phoneNumber, docterName, address, medicine1, medicine2, schedule },
      { new: true }
    );

    if (!updatedPrescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    res.status(200).json({ message: 'Prescription updated successfully', data: updatedPrescription });
  } catch (error) {
    res.status(500).json({ message: 'Error updating prescription', error });
  }
});

// Delete Prescription
app.delete('/api/prescriptions/:id', async (req, res) => {
  try {
    const deletedPrescription = await Prescription.findByIdAndDelete(req.params.id);
    if (!deletedPrescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    res.status(200).json({ message: 'Prescription deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting prescription', error });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
