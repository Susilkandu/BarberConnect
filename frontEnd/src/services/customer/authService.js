import API from "../api"

const authServices = {
    //send otp on Email for Registration
    sendOtpOnEmai : async({email}) =>{
        const res = await API.post('/customer/sendOtpOnEmail',{email});
        return res;
    },
    // for getting registration step
    getRegistrationStep : async() => {
        const res = await API.get('/customer/getRegistrationStep',{withCredentials:true});
        return res;
    },
    
    // for verify otp for the registration
    verifyOtpForReg : async({email, otp}) =>{
        const res = await API.post('/customer/verifyOtpForReg',{email, otp});
        return res;
    },

    // for save Basic Info such as name, gender , phone number
    saveBasicInfoForReg : async({name, gender, phone}) =>{
        const res = await API.patch('/customer/saveBasicInfoForReg',{name, gender, phone});
        return res;
    },

    // for save the Dob, password and Location for the registration first time Last Step

    saveDobPsdAndLctForReg : async({dob, password, location_coordinates}) =>{
        const res = await API.patch('/customer/saveDobPsdAndLctForReg', {dob,password, location_coordinates});
        return res;
    },
    

    // for login via credential with email password

    login : async ({email, password})=>{
        const res = await API.post('/customer/login', {email, password});
        return res;
    }

}
export default authServices;