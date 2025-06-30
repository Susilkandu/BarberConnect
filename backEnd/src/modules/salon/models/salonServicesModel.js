const mongoose = require('mongoose');
const {Schema} = mongoose;

const salonServicesSchema = new Schema({
    salon_id:{
        type:Schema.Types.ObjectId,
        ref:'salon',
        required:true,
    },
    service_id:{
        type: Schema.Types.ObjectId,
        ref:'masterservice',
        required:true,
    },
    price:{
        type: Number,
        required: true,
    },
    estimated_duration:{
        type: Number,
        required: true,
    },
    gender:{
        type: String, 
        enum: ['male', 'female', 'unisex'],
        required: true,
    },
    isDeleted: {
        type: Boolean
    }
});
const SalonServices = mongoose.model("salonService",salonServicesSchema);
module.exports = SalonServices;