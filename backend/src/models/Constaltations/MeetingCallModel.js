// models/VideoCall.js
const mongoose = require('mongoose');

const videoCallSchema = new mongoose.Schema({
  // ==================== ORIGINAL FIELDS FROM YOUR TABLE ====================
  BookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',       // Links directly to the booked appointment
    required: true
  },

  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },

  pharmacistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',              // Pharmacist / staff conducting the call
    required: true
  },

  callStart: {
    type: Date,               // Actual time the video call started
    required: true
  },

  callEnd: {
    type: Date,               // Actual time the video call ended
    required: false
  },

  notes: {
    type: String,             // Consultation notes written during/after the call
    required: false,
    trim: true
  },

  // ==================== ENHANCED FIELDS FOR VIDEO CONSULTATION MANAGEMENT ====================
  // These are essential for a real pharmacy / telehealth video call system

  status: {
    type: String,
    enum: ['scheduled', 'ongoing', 'completed', 'missed', 'failed', 'cancelled'],
    default: 'scheduled',
    required: true
  },

  duration: {
    type: Number,             // Duration in minutes (auto-calculated on end)
    min: 0,
    required: false
  },

  videoPlatform: {
    type: String,
    enum: ['zoom', 'google_meet', 'internal', 'other'],
    default: 'zoom',
    required: true
  },

  meetingId: {
    type: String,             // External meeting ID (Zoom Meeting ID, etc.)
    required: false,
    trim: true
  },

  recordingUrl: {
    type: String,             // Link to recorded session (if enabled)
    required: false,
    trim: true
  },

  // Quality & feedback (very useful for pharmacy service improvement)
  patientRating: {
    type: Number,
    min: 1,
    max: 5,
    required: false
  },

  pharmacistRating: {
    type: Number,
    min: 1,
    max: 5,
    required: false
  },

  technicalIssues: {
    type: String,             // e.g. "Poor connection", "Audio lag", "None"
    required: false,
    trim: true
  },

  // Soft delete & audit
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true   // Automatically adds createdAt + updatedAt
});

// ==================== INDEXES (CRITICAL FOR VIDEO CALL QUERIES) ====================
videoCallSchema.index({ appointmentId: 1 });
videoCallSchema.index({ patientId: 1, callStart: -1 });
videoCallSchema.index({ pharmacistId: 1, callStart: -1 });
videoCallSchema.index({ status: 1, callStart: -1 });

// ==================== MIDDLEWARE: Auto-calculate duration when call ends ====================
videoCallSchema.pre('save', function (next) {
  if (this.callEnd && this.callStart) {
    const diffMs = this.callEnd - this.callStart;
    this.duration = Math.round(diffMs / 1000 / 60); // minutes
  }
  next();
});

// Virtual for easy display
videoCallSchema.virtual('callDurationFormatted').get(function () {
  if (!this.duration) return 'In progress';
  return `${this.duration} minute${this.duration !== 1 ? 's' : ''}`;
});

const VideoCall = mongoose.model('VideoCall', videoCallSchema);

module.exports = VideoCall;