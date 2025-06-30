import API from "../api";

const bookingServices = {
    // For booking of the salons/ beauty parler
    bookSlot: async(salon_id, name, services, paymentMode, selectedDate)=>{
        const res = await API.post("/booking/bookSlot",{salon_id, name, services, paymentMode, selectedDate});
        return res;
    },
    getBookingHistory: async()=>{
        const res = await API.get("/customer/getBookingHistory");
        return res;
    },
    getBookingDetails: async(booking_id)=>{
        const res = await API.get(`/customer/getBookingDetails/${booking_id}`);
        return res;
    }
};


export default bookingServices;