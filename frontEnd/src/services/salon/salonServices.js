import API from "../api";
/**
 * All barber-related API calls.
 * Each method returns the Axios response data.
 */
const salonServices = {
  // 1️⃣ Register basic info (Step 1)
  registerBasicInfo: async (owner_name, email, phone, password) => {
    const res = await API.post("/salon/register", {
      owner_name,
      email,
      phone,
      password,
    });
    return res;
  },

  // 2️⃣ Verify email via OTP (Step 2)
  verifyEmailOtp: async (eOtp) => {
    const res = await API.post("/salon/verifyEmailViaOtp", { eOtp });
    return res;
  },

  // 3️⃣ Add business details (Step 3)
  addSalonDetails: async (salon_name, full_address, location_coordinates) => {
    const payload = {
      salon_name,
      full_address,
      location_coordinates: {
        type: "Point",
        coordinates: location_coordinates,
      },
    };
    const res = await API.put("/salon/addDetails", payload);
    return res;
  },
  addChargeRange: async(average_price_range)=>{
    const res = await API.put("/salon/addPriceRange",{average_price_range})
    return res;
  },

  // 5️⃣ Add profile details (Step 5)
  addProfileDetails: async (bio, experience, social_links) => {
    const res = await API.put("/salon/addProfile", {
      bio,
      experience,
      social_links,
    });
    return res;
  },

  // 6️⃣ Add Bank details (Step 6)
  addBankDetails: async (bank_details) => {
    const res = await API.put("/salon/addBankDetails", { bank_details });
    return res
  },
  // For Updating The Working Details
  updateWorkingDetails: async (filters) => {
    const res = await API.patch("/salon/updateWorkingDetails", {...filters});
    return res;
  },
  // Extra: login & fetch profile
  login: async (email, password) => {
    const res = await API.post("/salon/login", { email, password });
    return res;
  },
  // Reset Password
  // Send OTP on email for reset Password
  sendOtpToResetPsd: async (email) => {
    const res = await API.post("/salon/sendOtpToResetPsd", { email });
    return res;
  },
  verifyOtpAndUpdatePass: async (email, eOtp, password) => {
    const res = await API.post("/salon/verifyOtpAndUpdatePass", {
      email,
      eOtp,
      password,
    });
    return res;
  },
  getProfile: async () => {
    const res = await API.get("/salon/myProfile");
    return res;
  },
  changeProfilePhoto: async (photoFile) => {
    const formData = new FormData();
    formData.append("profilePhoto", photoFile);
    const res = await API.put("/salon/changeProfilePhoto", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res;
  },
  changeBannerPhoto: async (photoFile) => {
    const formData = new FormData();  
    formData.append("bannerPhoto", photoFile);
    const res = await API.put("/salon/changeBannerPhoto", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res;
  },
  getAllMasterServices: async () => {
    const res = await API.get("/salon/getAllMasterServices");
    return res;
  },
  addSalonServices: async (service_id, price, estimated_duration, gender) => {
    const res = await API.patch("/salon/addSalonServices", {
      service_id,
      price,
      estimated_duration,
      gender,
    });
    return res;
  },
  getAllSalonServices: async () => {
    const res = await API.get("/salon/getAllSalonServices");
    return res;
  },
  removeSalonServices: async (service_id) => {
    const res = await API.delete(`/salon/removeSalonServices/${service_id}`);
    return res;
  },
  getBookings: async(selectedDate)=>{
    const res = await API.get(`/salon/getBookings/${selectedDate}`);
    return res;
  }
};

export default salonServices;
