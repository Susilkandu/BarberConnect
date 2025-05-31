import API from "../api"

const profileService = {
 // Fetch user profile
 getProfile: async()=>{
    const res = await API.get('/customer/myProfile');
    return res;
 },
 // Change Profile Photo
 changeProfilePhoto: async(photoFile)=>{
    const formData = new FormData();
    formData.append('profilePhoto', photoFile);
    const res = await API.post('/customer/changeProfilePhoto',formData,{
        headers: {'Content-Type':'multipart/form-data'}
    });
    return res;
 },

 // Update Profile data
 updateProfile: async (data)=>{
    const res = await API.patch('/customer/updateProfile',{...data});
    return res;
 }
    
}
export default profileService;