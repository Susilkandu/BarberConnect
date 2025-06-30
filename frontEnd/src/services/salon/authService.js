import API from "../api"

const authServices = {
    getRegistrationStep : async() => {
        const res = await API.get('/salon/getRegistrationStep',{withCredentials:true});
        return res;
    }
}
export default authServices;