import mongoose from "mongoose";
const BookingSchema = new mongoose.Schema({
  // ==================== ORIGINAL FIELDS FROM YOUR TABLE ====================
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',           // Reference to Patient model
    required: true
  },

  pharmacistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',              // Pharmacist (staff) from Users collection
    required: true
  },

  date: {
    type: Date,               // Full appointment datetime (e.g. 2026-04-15T10:00:00Z)
    required: true
  },

  timeSlot: {
    type: String,             // e.g. "10:00 AM - 10:30 AM" or "Morning slot"
    required: true,
    trim: true
  },

  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending',
    required: true
  },

  videoLink: {
    type: String,             // Generated Zoom/Google Meet link (for virtual consultations)
    required: false,
    trim: true
  },

  // ==================== ENHANCED FIELDS FOR A COMPLETE BOOKING / PHARMACY MANAGEMENT SYSTEM ====================
  // These are the fields nurses, pharmacists, and patients actually need in real appointment systems.

  reasonForAppointment: {
    type: String,             // e.g. "Medication review", "Allergy consultation", "Prescription refill"
    required: false,
    trim: true
  },

  meetingType: {
    type: String,
    enum: ['in-person', 'virtual', 'phone'],
    default: 'virtual',       // Since you have videoLink
    required: true
  },

  duration: {
    type: Number,             // in minutes (e.g. 15, 30)
    default: 30,
    min: 10
  },

  notes: {
    type: String,             // Pre-appointment notes from patient or pharmacist
    required: false,
    trim: true
  },

  // Status workflow tracking
  confirmedAt: {
    type: Date,
    required: false
  },

  completedAt: {
    type: Date,
    required: false
  },

  cancelledAt: {
    type: Date,
    required: false
  },

  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },

  cancellationReason: {
    type: String,
    required: false,
    trim: true
  },

  // Pharmacy-specific extras
  relatedPrescription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prescription',      // Link to a prescription if this appointment is for dispensing/review
    required: false
  },

  reminderSent: {
    type: Boolean,
    default: false
  },

  reminderSentAt: {
    type: Date,
    required: false
  },

  // Soft delete / active flag
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true   // Automatically adds createdAt + updatedAt
});

// ==================== INDEXES (CRITICAL FOR BOOKING SYSTEM PERFORMANCE) ====================
BookingSchema.index({ patientId: 1, date: 1 });
BookingSchema.index({ pharmacistId: 1, date: 1, status: 1 });
BookingSchema.index({ date: 1, status: 1 });           // For availability checks
BookingSchema.index({ status: 1 });

// Virtual to display full booking info
BookingSchema.virtual('fullDateTime').get(function () {
  return `${this.date.toDateString()} at ${this.timeSlot}`;
});

BookingSchema.virtual('isUpcoming').get(function () {
  return this.date > new Date() && ['pending', 'confirmed'].includes(this.status);
});

const Booking = mongoose.model('Booking', BookingSchema);

module.exports = Booking;