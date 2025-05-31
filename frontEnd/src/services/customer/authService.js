import API from "../api";

const authServices = {    

    // for login via credential with email password

    login : async ({email, password})=>{
        const res = await API.post('/customer/login', {email, password});
        return res;
    },

    // Send OTP to reset password
    sendOtpToResetPsd : async({email})=>{
        const res = await API.post('/customer/sendOtpToResetPsd',{email});
        return res;
    },
    
    // Verify OTP and update password
    verifyOtpAndUpdatePass: async({email,eOtp,password})=>{
        const res = await API.post('/customer/verifyOtpAndUpdatePass',{email, eOtp, password});
        return res;
    }

};
export default authServices;