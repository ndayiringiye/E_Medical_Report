// models/Prescription.js
const mongoose = require('mongoose');

const medicationSubSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  dosage: {
    type: String,
    required: true,           // e.g. "500mg", "1 tablet", "5ml"
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  frequency: {
    type: String,
    required: false,          // e.g. "Twice daily", "Every 8 hours"
    trim: true
  },
  duration: {
    type: String,
    required: false,          // e.g. "7 days", "2 weeks"
    trim: true
  },
  instructions: {
    type: String,
    required: false          // e.g. "Take with food", "Avoid alcohol"
  }
});

const prescriptionSchema = new mongoose.Schema({
  // ==================== REQUIRED FIELDS FROM YOUR TABLE ====================
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',           // Reference to Patient model
    required: true
  },

  pharmacistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',              // Pharmacist (or staff) from Users collection
    required: true
  },

  medications: {
    type: [medicationSubSchema],
    required: true,
    validate: {
      validator: function (meds) {
        return meds && meds.length > 0;
      },
      message: 'Prescription must contain at least one medication'
    }
  },

  status: {
    type: String,
    enum: ['pending', 'approved', 'dispensed', 'rejected'],
    default: 'pending',
    required: true
  },

  notes: {
    type: String,
    required: false,
    trim: true
  },

  // ==================== USEFUL FIELDS FOR PHARMACY MANAGEMENT ====================
  // (These are commonly needed in real pharmacy systems but were not in your original table)
  
  prescribedBy: {                 // Doctor who wrote the prescription
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },

  prescriptionDate: {
    type: Date,
    default: Date.now,
    required: true
  },

  expiryDate: {
    type: Date,
    required: false
  },

  totalCost: {
    type: Number,
    min: 0,
    required: false
  },

  insuranceCovered: {
    type: Boolean,
    default: false
  },

  // Pharmacy dispensing tracking
  dispensedAt: {
    type: Date,
    required: false
  },
  
  dispensedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },

  // Audit trail
  rejectionReason: {
    type: String,
    required: false,
    trim: true
  },
  imageUrl:{
    type:String,
    required:false,
     trim: true
  },

  // Soft delete / active status
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true   // Automatically adds createdAt + updatedAt
});

// ==================== INDEXES FOR FAST QUERIES (important for pharmacy system) ====================
prescriptionSchema.index({ patientId: 1, status: 1 });
prescriptionSchema.index({ pharmacistId: 1, createdAt: -1 });
prescriptionSchema.index({ status: 1 });                    // For dashboard filtering

// Virtual for easy display of full medication list
prescriptionSchema.virtual('medicationList').get(function () {
  return this.medications.map(m => `${m.name} - ${m.dosage} × ${m.quantity}`).join(', ');
});

const Prescription = mongoose.model('Prescription', prescriptionSchema);

module.exports = Prescription;