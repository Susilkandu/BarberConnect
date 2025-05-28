const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {type: String},
  email: { type: String, required:true, unique: true },
  phone: { type: String},
  password: { type: String},
  profileImage: String,
  gender: { type: String, enum: ['male', 'female', 'other']},
  dob: Date,
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String,
  },
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

  bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],
  favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Barber' }],
  walletBalance: { type: Number, default: 0 },
  rewardPoints: { type: Number, default: 0 },
  isBlocked: { type: Boolean, default: false },
  otp: {type: String},
  otp_expiry:{type: Date},
  isVerified:{Type: Boolean},
  profile_completion: { type: Number, default: 1 },
}, { timestamps: true });

customerSchema.index({ locationCoordinates: '2dsphere' });

const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;
