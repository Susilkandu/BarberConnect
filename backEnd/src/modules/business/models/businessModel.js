const mongoose = require('mongoose');
const { Schema } = mongoose;

const businessSchema = new Schema({
  // 🔐 Identity and Security
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true, unique: true},
  phone: { type: String, required: true },
  password: { type: String, required: true, select: false }, // Hide by default

  // 🏪 business Basics
  business_name: { type: String, trim: true },
  location: { type: String},
  location_coordinates: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      validate: {
        validator: (arr) => arr.length === 2,
        message: 'Coordinates must be [lng, lat]'
      }
    }
  },

  // 🕒 Availability
  working_hours: {
    type: Object,
    default: {}
  },
  available_days: [String],

  // 💰 Pricing
  average_price_range: {
    min: { type: Number },
    max: { type: Number }
  },

  // 💼 Professionalism
  experience: Number,
  bio: { type: String, maxlength: 500 }, // Short & engaging
  services_offered: [String],
  photos: [String],
  profile_image: String,

  // 🌟 Reviews & Ratings
  rating: { type: Number, default: 0 },

  // 🌐 Presence
  social_links: {
    type: [
      {
        platform: {
          type: String,
          enum: ['instagram', 'facebook', 'whatsapp', 'website'],
          required: true
        },
        link: {
          type: String,
          required: true
        }
      }
    ],
    default: undefined
  },  

  // ✅ Trust Signals
  is_verified: { type: Boolean, default: false },
  verified_by_admin: { type: Boolean, default: false }, // Internal validation
  profile_completion: { type: Number, default: 1 }, // 0-100%
  trust_score: { type: Number, default: 0 }, // System calculated score

  // 📅 Timestamps
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },

  // 🎯 Marketing
  featured: { type: Boolean, default: false },
  offers: [{
    title: String,
    description: String,
    discount_percent: Number,
    valid_till: Date
  }],

  // 📆 Booking
  slot_booking_enabled: { type: Boolean, default: false },
  slots: [String],

  // 🏦 Payment
  account_details: {
    account_holder_name: { type: String },
    account_number: { type: String},
    ifsc_code: { type: String},
    bank_name: { type: String},
    upi_id: String,
    is_verified: { type: Boolean, default: false }
  },

  // 📈 Behavioral Signals (psychological intelligence)
  last_active_at: { type: Date }, // Helps in engagement and nudging
  engagement_score: { type: Number, default: 0 }, // Calculated by activity
  onboarding_stage: {
    type: String,
    enum: ['new', 'profile_complete', 'verified', 'active'],
    default: 'new'
  },

  // 📌 Admin Flags
  status: {
    type: String,
    enum: ['active', 'suspended', 'deleted'],
    default: 'active'
  },
  otp: {type: String},
  otp_expiry: {type: Date}
  
});

businessSchema.index({ location_coordinates: '2dsphere' });

const Business = mongoose.model('Business', businessSchema);
module.exports = Business;
 