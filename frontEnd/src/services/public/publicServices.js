import API from "../api";

/*
All Public api for visitor as well as customer
*/
const publicServices ={
    // for getting the list of the barbers
    getBarbersList: async (filters)=>{
        const res = await API.get(`/public/barbers?${filters}`);
        return res;
    },
    // For View Barber Profile
    veiwBarberProfile: async(barber_id)=>{
        const res = await API.get(`/public/barbers${barber_id}`);
        return res;
    }
}

export default publicServices;