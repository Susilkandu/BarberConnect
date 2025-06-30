import API from "../api";

/*
All Public api for visitor as well as customer
*/
const publicServices ={
    // for getting the list of the barbers
    getSalonList: async (filters)=>{
        const res = await API.get(`/public/salons?${filters}`);
        return res;
    },
    // For View Barber Profile
    viewSalonProfile: async(queryParams)=>{
        const res = await API.get(`/public/viewSalonProfile?${queryParams}`);
        return res;
    }
}

export default publicServices;