const mongoose = require('mongoose');
const { Schema } = mongoose;

const salonSchema = new Schema({
  // 🔐 Identity and Security
  owner_name:{
    first_name:{type:String, required: true, trim:true},
    middle_name:{type: String, trim: true},
    last_name:{type: String, trim: true},
  },
  email: { type: String, required: true, lowercase: true, trim: true, unique: true},
  phone: { type: String, required: true },
  password: { type: String, required: true, select: false }, 

  // 🏪 salon Basics
  salon_name: { type: String, trim: true },
  full_address: { type: String},
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
  profile_image: String,
  banner: String,

  // 🕒 Availability System 
  operating_hours: {
    type: Map,
    of: new Schema({
      opening: { type: String, required: true }, 
      closing: { type: String, required: true }, 
      is_open: { type: Boolean, default: true }
    }),
    default: {
      '0': { opening: "09:00", closing: "20:00" }, // Sunday
      '1': { opening: "09:00", closing: "20:00" }, // Monday
      '2': { opening: "09:00", closing: "20:00" }, // Tuesday
      '3': { opening: "09:00", closing: "20:00" }, // Wednesday
      '4': { opening: "09:00", closing: "20:00" }, // Thursday
      '5': { opening: "09:00", closing: "20:00" }, // Friday
      '6': { opening: "09:00", closing: "20:00" }, // Saturday
    }
  },
    // 🚫 Blockout Dates 
  unavailable_dates: [{
    date: { type: Date, required: true },
    reason: { type: String }
  }],

    // ⏱️ Slot Configuration 
  slot_configuration: {
    buffer_time: { type: Number, default: 7, min: 0, max: 60 }, 
    max_parallel_bookings: { type: Number, default: 3, min: 1, max: 20 } 
  },
// 📆 Booking System (IMPROVED)
  booking_settings: {
    advance_booking_days: { type: Number, default: 7, min: 1, max: 365 }, // 7-day window
    min_advance_booking: { type: Number, default: 2, min: 0, max:24 }, // 2 hours before
    max_daily_bookings: { type: Number, default: 20, min: 1 },
    cancellation_policy: { 
      hours_required: { type: Number, default: 24 },
      fee_percent: { type: Number, default: 10 }
    }
  },

// 💰 Pricing (added validation)
  average_price_range: {
    min: { 
      type: Number, 
      min: 0,
      required: function() { return this.average_price_range.max !== undefined }
    },
    max: { 
      type: Number, 
      min: 0,
      validate: {
        validator: function(v) {
          return v >= (this.average_price_range.min || 0);
        },
        message: 'Max price must be >= min price'
      }
    }
  },

  // 💼 Professionalism
  experience: Number,
  bio: { type: String, maxlength: 500 }, 
  photos: [String],

  // 🌐 Social Links (validation added)
  social_links: {
    type: [{
      _id: false,
      platform: {
        type: String,
        enum: ['instagram', 'facebook', 'website', 'twitter', 'youtube'],
        required: true
      },
      link: {
        type: String,
        required: true,
        validate: {
          validator: function(v) {
            const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
            return urlPattern.test(v);
          },
          message: 'Invalid URL format'
        }
      }
    }],
    validate: {
      validator: function(v) {
        const platforms = new Set();
        for (const link of v) {
          if (platforms.has(link.platform)) return false;
          platforms.add(link.platform);
        }
        return true;
      },
      message: 'Duplicate platform links not allowed'
    }
  },

   // 🌟 Reviews & Ratings (enhanced)
  rating: { 
    type: Number, 
    default: 0,
    min: 0,
    max: 5,
    set: v => Math.round(v * 10) / 10 // Round to 1 decimal
  },
  rating_count: { type: Number, default: 0 },

  // ✅ Trust Signals 
  is_verified: { type: Boolean, default: false },
  verified_by_admin: { type: Boolean, default: false },
  verification_documents: [{
    type: { type: String, enum: ['id_proof', 'address_proof', 'certificate'] },
    url: String,
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
  }],
  profile_completion: { 
    type: Number, 
    default: 1,
    min: 0,
    max: 100 
  },
  trust_score: { 
    type: Number, 
    default: 0,
    min: 0,
    max: 100 
  },

  // 🎯 Marketing 
  featured: { type: Boolean, default: false },
  featured_expiry: { type: Date },
  offers: [{
    title: { type: String, required: true },
    description: String,
    discount_percent: { 
      type: Number,
      min: 1,
      max: 100 
    },
    validity: { 
      type: Date,
      validate: {
        validator: function(v) {
          return v > new Date();
        },
        message: 'Offer must be for future date'
      }
    },
      min_order_value: { 
    type: Number,
    validate: {
      validator: function(v) {
        return v === undefined || v >= 0;
      },
      message: 'Minimum order value cannot be negative'
    }},
    applicable_services: [{ type: Schema.Types.ObjectId, ref: 'Service' }]
  }],
   

  // 🏦 Bank details
  bank_details: {
    bank_name: { type: String},
    ifsc_code: { type: String},
    account_holder_name: { type: String },
    account_number: { type: String},
    upi_id: String,
    primary:{
      type: String,
      enum: ['bank','upi'],
      required: false,
    },
    is_verified_bank: { type: Boolean, default: false },
    is_verified_upi: { type: Boolean, default: false}
  },

   // 📈 Behavioral Signals 
  last_active_at: { type: Date },
  engagement_score: { 
    type: Number, 
    default: 0,
    min: 0,
    max: 100 
  },
  onboarding_stage: {
    type: String,
    enum: ['new', 'profile_complete', 'verified', 'active', 'premium'],
    default: 'new'
  },
    // 📌 Admin Flags (added audit trail)
  status: {
    type: String,
    enum: ['active', 'deactivated', 'suspended'],
    default: 'active'
  },
  status_history: [{
    status: String,
    enum: ['active', 'deactivated', 'suspended'],
    changed_at: Date,
    changed_by: { type: Schema.Types.ObjectId, ref: 'User' },
    reason: String
  }],
  otp: { type: String, select: false },
  otp_expiry: { type: Date, select: false },

    // ⏳ Booking Time Management (optimized)
  base_times: [{
    date: { 
      type: Date, 
      required: true,
      index: true
    },
    last_slot_end: { 
      type: Date,
      required: true
    }
  }],

  // 📅 Enhanced Timestamps 
  created_at: { type: Date, default: Date.now, immutable: true },
  updated_at: { type: Date, default: Date.now },
  last_booking_sync: { type: Date }, // Last time slots were updated
  
});

// 📅 Pre-save hook for auto-updates
salonSchema.pre('save', function(next) {
  this.updated_at = new Date();
  
  // Auto-calculate profile completion
  const requiredFields = ['salon_name', 'full_address', 'phone', 'photos', 'profile_image'];
  const completedFields = requiredFields.filter(field => this[field]);
  this.profile_completion = Math.round((completedFields.length / requiredFields.length) * 100);
  
 // Clean up past base_times (older than 1 day)
  if (this.base_times && this.base_times.length > 0) {
    const now = new Date();
    this.base_times = this.base_times.filter(bt => {
      return bt.date >= now;
    });
    
    // Then check for duplicates
    const dates = new Set();
    this.base_times.forEach(bt => {
      if (dates.has(bt.date.toISOString())) {
        throw new Error(`Duplicate date found in base_times: ${bt.date}`);
      }
      dates.add(bt.date.toISOString());
    });
  }

  next();
});

salonSchema.index({ 
  'base_times.date': 1,
  'unavailable_dates.date': 1
});
// 🔍 Text search index (for salon search)
salonSchema.index({
  'salon_name': 'text',
  'full_address': 'text',
  'owner_name.first_name': 'text',
  'owner_name.last_name': 'text'
});

// 📌 Additional indexes for performance
salonSchema.index({ 'unavailable_dates.date': 1 });
salonSchema.index({ 'base_times.date': 1 });
salonSchema.index({ status: 1, is_verified: 1 });

// 🗓️ Next 7 days availability virtual
salonSchema.virtual('next_week_availability').get(function() {
   const days = [];
  const today = new Date();
  today.setHours(0,0,0,0); // Reset time to midnight
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    
    days.push({
      date: date,
      day: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][dayOfWeek],
      opening: this.operating_hours.get(dayOfWeek.toString())?.opening || '09:00',
      closing: this.operating_hours.get(dayOfWeek.toString())?.closing || '20:00',
      is_available: !this.unavailable_dates.some(d => 
        d.date.toDateString() === date.toDateString()
      )
    });
  }
  return days;
});

// ✅ Check slot availability method
salonSchema.methods.checkSlotAvailability = function(date, duration) {
  const day = new Date(date).getDay();
  const hours = this.operating_hours.get(day.toString());
  
  if (!hours || !hours.is_open) return false;
  
  // Check if date is blocked
  const isBlocked = this.unavailable_dates.some(d => 
    d.date.toDateString() === new Date(date).toDateString()
  );
  
  return !isBlocked;
};

// Hide sensitive information in toJSON
salonSchema.set('toJSON', {
  transform: function(doc, ret) {
    delete ret.password;
    delete ret.otp;
    delete ret.otp_expiry;
    return ret;
  }
});

// Hide sensitive fields by default
salonSchema.statics.protectedFields = [
  'password',
  'otp',
  'otp_expiry',
];
salonSchema.index({ location_coordinates: '2dsphere' });
salonSchema.index({email:1});

const Salon = mongoose.model('salon', salonSchema);
module.exports = Salon;
 