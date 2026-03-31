// models/Patient.js
const { required } = require('joi');
const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  // ==================== ORIGINAL FIELDS (as provided) ====================
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',          // References the Users collection
    required: true,
    unique: true          // One patient profile per user
  },
  
  dateOfBirth: {
    type: Date,
    required: true
  },
  
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other', 'Prefer not to say'], // Expanded for inclusivity
    required: true
  },
  
  address: {
    type: String,
    required: false
  },
  
  allergies: {
    type: [{
      allergen: { type: String, required: true },      // e.g. "Penicillin"
      reaction: { type: String, required: false }      // e.g. "Rash", "Anaphylaxis"
    }],
    default: []
  },
  
  medicalHistory: {
    type: String,
    required: false
  },

  height: {
    type: Number,          
    required: false
  },
  
  weight: {
    type: Number,           
    required: false
  },
  
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'],
    default: 'Unknown'
  },
  
  currentMedications: {
    type: [{
      name: { type: String, required: true },        // e.g. "Metformin"
      dosage: { type: String },                       // e.g. "500mg"
      frequency: { type: String },                    // e.g. "Twice daily"
      startDate: { type: Date }
    }],
    default: []
  },
  
  chronicConditions: {
    type: [String],                                   // e.g. ["Diabetes", "Hypertension"]
    default: []
  },
  
  lifestyleHabits: {
    smoking: {
      type: String,
      enum: ['Never', 'Former', 'Current', 'Unknown'],
      default: 'Unknown'
    },
    alcohol: {
      type: String,
      enum: ['Never', 'Occasional', 'Regular', 'Unknown'],
      default: 'Unknown'
    },
    exercise: {
      type: String,                                   // e.g. "None", "Moderate", "Daily"
      default: 'Unknown'
    }
  },
  
  familyHistory: {
    type: String,                                     // e.g. "Father had heart disease"
    required: false
  },
  
  emergencyContact: {
    name: { type: String },
    relationship: { type: String },                   // e.g. "Spouse", "Son"
    phone: { type: String },
    address: { type: String }
  },
  
  // Nurse-specific / treatment-related fields
  presentingComplaint: {
    type: String,                                     // Chief reason for visit / current symptoms
    required: false
  },
  
  painLevel: {
    type: Number,                                     // 0-10 scale (common nursing assessment)
    min: 0,
    max: 10,
    required: false
  },
  lastVitalSigns: {
    bloodPressure: String,                            // e.g. "120/80 mmHg"
    heartRate: Number,                                // bpm
    temperature: Number,                              // °C
    oxygenSaturation: Number,                         // %
    recordedAt: { type: Date, default: Date.now }
  },
  lastNurseVisit: {
    type: Date,
    required: false
  },
  
  notes: {
    type: String,                                     // Additional free-text notes from nurses
    required: false
  }, 
  image: {
    type: String,
    required: false,
    size: 1024 * 1024 * 5 // Max 5MB

  },
  PaymentOptions:{
    type:String,
    enum: ['Insurance', 'Self-Pay', 'Medicare', 'Medicaid', 'Other'],
    default: 'Self-Pay',
    paymentType:{
        type:String,
        enum: ['Credit Card', 'Debit Card', 'Cash', 'Check', 'Online Payment', 'Other'],
        default: 'Other'
    },
    status:{
        type:String,
        enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
        default: 'Pending'
    }
  }
}, {
  timestamps: true  
});

patientSchema.index({ userId: 1 });

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;