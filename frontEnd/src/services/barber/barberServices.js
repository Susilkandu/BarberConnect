import API from '../api';

/**
 * All barber-related API calls.
 * Each method returns the Axios response data.
 */
const barberService = {
  // 1️⃣ Register basic info (Step 1)
  registerBasicInfo: async ({ name, email, phone, password }) => {
    const res = await API.post('/business/register', { name, email, phone, password });
    return res.data; // expect { token, ... }
  },

  // 2️⃣ Verify email via OTP (Step 2)
  verifyEmailOtp: async (eOtp) => {
    const res = await API.post('/business/verifyEmailViaOtp', { eOtp });
    return res.data;
  },

  // 3️⃣ Add business details (Step 3)
  addBusinessDetails: async ({ business_name, location, location_coordinates }) => {
    const payload = {
      business_name,
      location,
      location_coordinates:{
        type:"Point",
        coordinates:location_coordinates
      },
    };
    const res = await API.put('/business/addDetails', payload);
    return res.data;
  },

  // 4️⃣ Add services offered (Step 4)
  addBusinessServices: async ({ services_offered, average_price_range }) => {
    const res = await API.put('/business/addServices', { services_offered, average_price_range });
    return res.data;
  },

  // 5️⃣ Add profile details (Step 5)
  addProfileDetails: async ({ bio, experience, social_links }) => {
    const res = await API.put('/business/addProfile', { bio, experience, social_links });
    return res.data;
  },

  // 6️⃣ Add payment details (Step 6)
  addPaymentDetails: async (account_details) => {
    const res = await API.put('/business/addPaymentDetails', { account_details });
    return res.data;
  },

  // Extra: login & fetch profile
  login: async ({ email, password }) => {
    const res = await API.post('/business/login', { email, password });
    return res;
  },
  // Reset Password
  // Send OTP on email for reset Password
  sendOtpToResetPsd : async ({email}) =>{
    const res = await API.post('/business/sendOtpToResetPsd', {email});
    return res;
  },
  verifyOtpAndUpdatePass : async ({email, eOtp, password}) =>{
    const res = await API.post('/business/verifyOtpAndUpdatePass',{email, eOtp, password});
    return res;
  },
  getProfile: async () => {
    const res = await API.get('/business/myProfile');
    return res.data;
  },
  changeProfilePhoto: async (photoFile) => {
    const formData = new FormData();
    formData.append('profilePhoto', photoFile);
    const res = await API.put('/business/changeProfilePhoto',formData,{
      headers:{
        'Content-Type':'multipart/form-data',
      }
    });
    return res.data;
  } 
  
};

export default barberService;
