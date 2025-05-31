import API from "../api";
const customerServices ={

    // Send OTP for registration

    sendOtpOnEmailForReg: async({email})=>{
        const res = await API.post('/customer/sendOtpOnEmailForReg',{email});
        return res;
    },
    resendOtpOnEmailForReg: async({email})=>{
        const res = await API.patch('/customer/resendOtpOnEmailForReg',{email});
        return res;
    },
    
    // Get current Registration step

    getRegistrationStep: async ()=>{
        const res = await API.get('/customer/getRegistrationStep');
        return res;
    },

    // Verify OTP for registration

    verifyOtpForReg: async({email, otp})=>{
        const res = await API.post('/customer/verifyOtpForReg',{ email, otp});
        return res;
    },

    // Save Basic Information: name, gender, phone

    SaveBasicInfoForReg: async({name, gender, phone})=>{
        const res = await API.patch('/customer/saveBasicInfoForReg',{name, gender, phone});
        return res;
    },

    // Save DOB, password, and location
    saveDobPsdAndLctForReg: async ({dob, password, location_coordinates})=>{
        const res = await API.patch('/customer/saveDobPsdAndLctForReg', {dob, password, location_coordinates});
        return res;
    }
};
export default customerServices;