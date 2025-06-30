const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bookingSchema = new Schema({
    customer_id: {
        type: Schema.Types.ObjectId,
        ref:'customer',
        required: true,
    },
    name:{
        type: String, 
        required: true,
    },
    salon_id:{
        type: Schema.Types.ObjectId,
        ref: "salon",
        required: true
    },
    required_services:[
        {
            service_id: {
                type: Schema.Types.ObjectId,
                ref: "masterservice",
                required: true,
            },
            price:{
                type: Number,
                required: true
            },
            estimated_duration:{
                type: Number,
                required: true,
            },
            gender:{
                type: String,
                required: true
            }
        }
    ],
    total_price:{
        type: Number,
        required: true,
    },
    paymentMode:{
        type: String,
        required: true,
        enum:['cash','online']
    },
    paymentStatus:{
        type: String,
        required: true,
        enum:['pending', 'paid', 'refunded'],
        default:"pending"
    },
    status:{
        type: String,
        required: true, 
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: "pending"
    },
    bookingDate:{
        type: Date,
    },
    starting_time_slot:{
        type: Date,
    },
    ending_time_slot:{
        type: Date,
    }
});
const Booking = mongoose.model("bookings", bookingSchema);
module.exports = Booking;