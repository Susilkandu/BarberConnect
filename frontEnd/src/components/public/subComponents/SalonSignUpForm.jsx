import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {useDispatch} from 'react-redux';
import { useSelector } from "react-redux";
import {setLoading} from '../authSlice';

import { toast } from "react-hot-toast";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaKey,
  FaUniversity,
} from "react-icons/fa";
import { FiCreditCard } from "react-icons/fi";
import { BiCurrentLocation } from "react-icons/bi";
import { FaLocationDot } from "react-icons/fa6";
import { MdAddBusiness, MdContactPhone } from "react-icons/md";
import salonServices from "../../../services/salon/salonServices";
import authService from "../../../services/salon/authService";
import requestHandler from "../../../utils/requestHandler";

const SalonSignUpForm = () => {
  useEffect(() => {
    if (Cookies.get("salonToken")) {
      (async () => {
        try {
          await requestHandler(dispatch, ()=> authService.getRegistrationStep(),0,
          {
            onSuccess: (res)=>{
              if(res?.data?.data?.step == 6){
                toast.success("Your Profile Registration Completed");
                navigate("/");
                return;
              }
              setStep(res?.data?.data?.step);
            }
          })
        } catch (error) {
          console.error(error);
        }
      })();
    }
  }, []);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector(state=>state.auth.loading);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    owner_name:{
      first_name:"",
      middle_name:"",
      last_name:"",
    },
    email: "",
    phone: "",
    password: "",
    repeatPassword: "",
    eOtp: "",
    salon_name: "",
    full_address: "",
    location_coordinates: ["", ""],
    average_price_range: { min: "", max: "" },
    bio: "",
    experience: "",
    social_links: [{ platform: "", link: "" }],
    bank_details: {
      bank_name: "",
      ifsc_code: "",
      account_holder_name: "",
      account_number: "",
      upi_id: "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if(name.includes('.')){
      const [parent, child] = name.split('.');
      setFormData((prev) => ({ ...prev, [parent]:{
        ...prev[parent],
        [child]:value
      }}));
    }else{
    setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // const handleCoordinateChange = (index, value) => {
  //   const updatedCoords = [...formData.location_coordinates];
  //   updatedCoords[index] = value;
  //   setFormData((prev) => ({ ...prev, location_coordinates: updatedCoords }));
  // };

  const handleLocationCoords = () => {
    dispatch(setLoading({loading:true}));
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData((prev) => ({
          ...prev,
          location_coordinates: [longitude, latitude],
        }));
      },
      (error) => {
        if (error.code == 1) {
          toast.error(
            "Location permission denied. Please enable location access in your browser settings."
          );
          return;
        }
        toast.error("Unable to get current location");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
    dispatch(setLoading({loading:false}));
  };

  const handleSocialLinkChange = (index, field, value) => {
    const updatedLinks = [...formData.social_links];
    updatedLinks[index][field] = value;
    setFormData((prev) => ({ ...prev, social_links: updatedLinks }));
  };
  const addSocialLink = () => {
    if (formData.social_links.length >= 4) return;
    setFormData({
      ...formData,
      social_links: [...formData.social_links, { platform: "", link: "" }],
    });
  };

  const removeSocialLink = (index) => {
    const updatedLinks = [...formData.social_links];
    updatedLinks.splice(index, 1);
    setFormData({
      ...formData,
      social_links: updatedLinks,
    });
  };

  
  const isValidIFSC = (ifsc) => {
    const regex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    return regex.test(ifsc.toUpperCase());
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      switch (step) {
        case 1: {
          const { owner_name, email, phone, password, repeatPassword } = formData;
          if (password !== repeatPassword) {
            toast.error("Both Password must be match");
            return;
          }
          await requestHandler(dispatch, ()=>salonServices.registerBasicInfo(owner_name,email,phone,password),1,
          {
            onSuccess: (res)=>{
              toast.success(res?.data?.data?.message);
              setStep(1.1)
            }
          });
          break;
        }
        case 1.1: {
          const { eOtp } = formData;
          await requestHandler(dispatch, ()=>salonServices.verifyEmailOtp(eOtp),1,
          {
            onSuccess: (res)=>{
              setStep(2)
            }
          });
          break;
        }
        case 2: {
          const { salon_name, full_address, location_coordinates } = formData;
          await requestHandler(dispatch, ()=>salonServices.addSalonDetails(salon_name, full_address, location_coordinates),1,
          {
            onSuccess: (res)=>{
              setStep(3);
            }
          });
          break;
        }
        case 3: {
          const { average_price_range } = formData;
          await requestHandler(dispatch, ()=>salonServices.addChargeRange(average_price_range),1,
          {
            onSuccess: (res)=>{
              setStep(4);
            }
          });
          break;
        }
        case 4: {
          const { bio, experience, social_links } = formData;
          await requestHandler(dispatch, ()=>salonServices.addProfileDetails(bio, experience, social_links),1,
          {
            onSuccess: (res)=>{
              setStep(5)
            }
          });
        }
        case 5: {
          const { bank_details } = formData;
          if (!isValidIFSC(bank_details.ifsc_code)) {
            toast.error("IFSC code is not valid");
            return;
          }
          await requestHandler(dispatch, ()=>salonServices.addBankDetails(bank_details),1,
          {
            onSuccess: (res)=>{
              setStep(6);
              navigate("/");
            }
          });
          break;
        }
        case 6: {
          navigate("/");
        }
      }
    } catch (err) {
      console.log("Error Occured: ",err);
    } 
  };
  return (
    <div className="w-full space-y-6 transition-all ease-in-out duration-300">
      <h2 className="text-3xl font-bold text-center">Salon Registration</h2>
      <p className="text-center text-sm text-gray-400 mb-4">Step {step} of 6</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1 */}
        {step === 1 && (
          <>
            {/* Name */}
            <div className="relative">
              <label className="text-sm font-medium text-gray-600 block mb-1">
                * First Name 
              </label>
              <div className="flex items-center border border-gray-300 rounded-xl bg-[#F9FAFB] focus-within:ring-2 focus-within:ring-[#FFD369]">
                <span className="px-3 text-gray-500">
                  <FaUser />
                </span>
                <input
                  type="text"
                  name="owner_name.first_name"
                  required
                  placeholder="Enter First Name"
                  value={formData.owner_name.first_name}
                  onChange={handleChange}
                  className="w-full py-3 bg-transparent outline-none text-gray-800 placeholder:text-gray-400 rounded-r-xl"
                />
              </div>
            </div>
            <div className="relative">
              <label className="text-sm font-medium text-gray-600 block mb-1">
                Middle Name 
              </label>
              <div className="flex items-center border border-gray-300 rounded-xl bg-[#F9FAFB] focus-within:ring-2 focus-within:ring-[#FFD369]">
                <span className="px-3 text-gray-500">
                  <FaUser />
                </span>
                <input
                  type="text"
                  name="owner_name.middle_name"
                  placeholder="Enter Middle Name"
                  value={formData.owner_name.middle_name}
                  onChange={handleChange}
                  className="w-full py-3 bg-transparent outline-none text-gray-800 placeholder:text-gray-400 rounded-r-xl"
                />
              </div>
            </div>
            <div className="relative">
              <label className="text-sm font-medium text-gray-600 block mb-1">
                Last Name 
              </label>
              <div className="flex items-center border border-gray-300 rounded-xl bg-[#F9FAFB] focus-within:ring-2 focus-within:ring-[#FFD369]">
                <span className="px-3 text-gray-500">
                  <FaUser />
                </span>
                <input
                  type="text"
                  name="owner_name.last_name"
                  placeholder="Enter Last Name"
                  value={formData.owner_name.last_name}
                  onChange={handleChange}
                  className="w-full py-3 bg-transparent outline-none text-gray-800 placeholder:text-gray-400 rounded-r-xl"
                />
              </div>
            </div>
            {/* Email */}
            <div className="relative">
              <label className="text-sm font-medium text-gray-600 block mb-1">
                Email Address
              </label>
              <div className="flex items-center border border-gray-300 rounded-xl bg-[#F9FAFB] focus-within:ring-2 focus-within:ring-[#FFD369]">
                <span className="px-3 text-gray-500">
                  <FaEnvelope />
                </span>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="johny11@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full py-3 bg-transparent outline-none text-gray-800 placeholder:text-gray-400 rounded-r-xl"
                />
              </div>
            </div>
            {/* Phone */}
            <div className="relative">
              <label className="text-sm font-medium text-gray-600 block mb-1">
                Contact Number
              </label>
              <div className="flex items-center border border-gray-300 rounded-xl bg-[#F9FAFB] focus-within:ring-2 focus-within:ring-[#FFD369]">
                <span className="px-3 text-gray-500">
                  <MdContactPhone />
                </span>
                <input
                  type="text"
                  name="phone"
                  placeholder="6340473737"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full py-3 bg-transparent outline-none text-gray-800 placeholder:text-gray-400 rounded-r-xl"
                />
              </div>
            </div>
            {/* Create Password */}
            <div className="relative">
              <label className="text-sm font-medium text-gray-600 block mb-1">
                Create Password
              </label>
              <div className="flex items-center border border-gray-300 rounded-xl bg-[#F9FAFB] focus-within:ring-2 focus-within:ring-[#FFD369]">
                <span className="px-3 text-gray-500">
                  <FaLock />
                </span>
                <input
                  type="password"
                  name="password"
                  placeholder="Xxxxxxx"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full py-3 bg-transparent outline-none text-gray-800 placeholder:text-gray-400 rounded-r-xl"
                />
              </div>
            </div>
            {/*Repeat Password */}
            <div className="relative">
              <label className="text-sm font-medium text-gray-600 block mb-1">
                Repeat Password
              </label>
              <div className="flex items-center border border-gray-300 rounded-xl bg-[#F9FAFB] focus-within:ring-2 focus-within:ring-[#FFD369]">
                <span className="px-3 text-gray-500">
                  <FaLock />
                </span>
                <input
                  type="password"
                  name="repeatPassword"
                  placeholder="Xxxxxxx"
                  value={formData.repeatPassword}
                  onChange={handleChange}
                  className="w-full py-3 bg-transparent outline-none text-gray-800 placeholder:text-gray-400 rounded-r-xl"
                />
              </div>
            </div>
          </>
        )}

        {/* Step 1.1 */}
        {step === 1.1 && (
          <>
            {/* OTP */}
            <div className="relative">
              <label className="text-sm font-medium text-gray-600 block mb-1">
                Enter OTP
              </label>
              <div className="flex items-center border border-gray-300 rounded-xl bg-[#F9FAFB] focus-within:ring-2 focus-within:ring-[#FFD369]">
                <span className="px-3 text-gray-500">
                  <FaKey />
                </span>
                <input
                  type="text"
                  name="eOtp"
                  placeholder="Enter OTP"
                  required
                  value={formData.eOtp}
                  minLength={6}
                  maxLength={6}
                  onChange={handleChange}
                  className="w-full py-3 bg-transparent outline-none text-gray-800 placeholder:text-gray-400 rounded-r-xl"
                />
              </div>
               {step==1.1 && <button type="submit" onClick={()=>{
                setStep(1);
               }} className="float-right text-blue-500 cursor-pointer">Resend OTP</button>}
            </div>
          </>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <>
            <div className="relative bg-[#F9FAFB] p-6 rounded-2xl shadow-md">
              <label className="text-sm font-medium text-gray-600 block mb-1">
                Salon Name
              </label>
              <div className="flex items-center border border-gray-300 rounded-xl bg-[#F9FAFB] focus-within:ring-2 focus-within:ring-[#FFD369]">
                <span className="px-3 text-gray-500">
                  <MdAddBusiness />
                </span>
                <input
                  type="text"
                  name="salon_name"
                  required
                  placeholder="Business Name"
                  value={formData.salon_name}
                  onChange={handleChange}
                  className="w-full py-3 bg-transparent outline-none text-gray-800 placeholder:text-gray-400 rounded-r-xl"
                />
              </div>
            </div>
            {/* Location */}
            <div className="relative">
              <label className="text-sm font-medium text-gray-600 block mb-1">
                Full Address
              </label>
              <div className="flex items-center border border-gray-300 rounded-xl bg-[#F9FAFB] focus-within:ring-2 focus-within:ring-[#FFD369]">
                <span className="px-3 text-gray-500">
                  <FaLocationDot />
                </span>
                <input
                  type="text"
                  name="full_address"
                  required
                  placeholder="Full Address"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full py-3 bg-transparent outline-none text-gray-800 placeholder:text-gray-400 rounded-r-xl"
                />
              </div>
            </div>
            <div className="flex justify-end w-3/3">
              <button
                onClick={handleLocationCoords}
                className="w-full max-w-fit p-2 rounded-xl bg-[#03297a] text-white text-lg text-center font-semibold hover:bg-yellow-500 hover:text-[#111827] transition-all duration-300 ease-in-out cursor-pointer"
              >
                <BiCurrentLocation className="inline mr-2" />
                Current location
              </button>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                disabled
                placeholder="Longitude"
                value={formData.location_coordinates[0]}
                className="input"
              />
              <input
                type="text"
                disabled
                placeholder="Latitude"
                value={formData.location_coordinates[1]}
                className="input"
              />
            </div>
          </>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <>
            <div className="w- max-w-xl mx-auto px-4 bg-[#F9FAFB] p-6 rounded-2xl shadow-md ">
              <h4 className="text-lg font-medium text-[#1F2937] mt-4">
                Average Price Range (₹)
              </h4>
              <div className="flex gap-4 mb-4">
                <input
                  type="number"
                  name="min"
                  placeholder="Min Price"
                  value={formData.average_price_range.min}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      average_price_range: {
                        ...prev.average_price_range,
                        min: e.target.value,
                      },
                    }))
                  }
                  className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg bg-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#FFD369] text-[#111827] placeholder:text-[#94A3B8]"
                />
                <input
                  type="number"
                  name="max"
                  placeholder="Max Price"
                  value={formData.average_price_range.max}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      average_price_range: {
                        ...prev.average_price_range,
                        max: e.target.value,
                      },
                    }))
                  }
                  className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg bg-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#FFD369] text-[#111827] placeholder:text-[#94A3B8]"
                />
              </div>
            </div>
          </>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <>
            <div className="space-y-6 bg-[#F9FAFB] p-6 rounded-2xl shadow-md">
              {/* Bio */}
              <div>
                <label className="block text-[#111827] font-semibold mb-1">
                  Bio
                </label>
                <span className="block float-right text-gray-500">
                  {formData.bio.length} Characters
                </span>
                <textarea
                  name="bio"
                  placeholder="Write a short bio..."
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full rounded-xl p-4 bg-white border border-[#E5E7EB] focus:ring-2 focus:ring-[#FFD369] text-[#111827] placeholder:text-[#94A3B8] resize-none"
                  rows={4}
                ></textarea>
              </div>

              {/* Experience */}
              <div>
                <label className="block text-[#111827] font-semibold mb-1">
                  Experience (in years)
                </label>
                <input
                  type="number"
                  name="experience"
                  placeholder="e.g. 3"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full rounded-xl p-4 bg-white border border-[#E5E7EB] focus:ring-2 focus:ring-[#FFD369] text-[#111827] placeholder:text-[#94A3B8]"
                />
              </div>

              {/* Social Links */}
              <div className="space-y-4">
                <label className="block text-[#111827] font-semibold mb-2">
                  Social Links
                </label>

                {formData.social_links.map((link, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row gap-4 items-start sm:items-center"
                  >
                    <select
                      value={link.platform}
                      onChange={(e) =>
                        handleSocialLinkChange(
                          index,
                          "platform",
                          e.target.value
                        )
                      }
                      className="w-full sm:w-1/3 rounded-xl p-3 bg-white border border-[#E5E7EB] focus:ring-2 focus:ring-[#FFD369] text-[#111827] placeholder:text-[#94A3B8]"
                    >
                      <option value="">Select Platform</option>
                      <option value="instagram">Instagram</option>
                      <option value="facebook">Facebook</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="website">Website</option>
                    </select>

                    <input
                      type="url"
                      placeholder="https://yourlink.com"
                      value={link.link}
                      onChange={(e) =>
                        handleSocialLinkChange(index, "link", e.target.value)
                      }
                      className="w-full sm:w-2/3 rounded-xl p-3 bg-white border border-[#E5E7EB] focus:ring-2 focus:ring-[#FFD369] text-[#111827] placeholder:text-[#94A3B8]"
                    />

                    <button
                      type="button"
                      onClick={() => removeSocialLink(index)}
                      className="text-red-500 hover:text-red-700 font-semibold text-sm mt-1 sm:mt-0"
                    >
                      Remove
                    </button>
                  </div>
                ))}

                {/* Add Social Link Button */}
                <button
                  type="button"
                  onClick={addSocialLink}
                  className={`text-[#1F2937] px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    formData.social_links.length >= 4
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-[#FFD369] hover:bg-[#facc15]"
                  }`}
                  disabled={formData.social_links.length >= 4}
                  title={
                    formData.social_links.length >= 4
                      ? "Maximum 4 social links allowed"
                      : ""
                  }
                >
                  + Add Social Link
                </button>
              </div>
            </div>
          </>
        )}

        {/* Step 5 */}
        {step === 5 && (
          <>
            {/* Bank Name */}
            <div className="flex items-center border border-gray-300 rounded-xl bg-[#F9FAFB] focus-within:ring-2 focus-within:ring-[#FFD369]">
              <span className="px-3 text-gray-500">
                <FaUniversity />
              </span>
              <input
                type="text"
                name="bank_name"
                required
                placeholder="Enter Bank Name"
                value={formData.bank_details.bank_name}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    bank_details: {
                      ...prev.bank_details,
                      bank_name: e.target.value,
                    },
                  }))
                }
                className="w-full py-3 bg-transparent outline-none text-gray-800 placeholder:text-gray-400 rounded-r-xl"
              />
            </div>
            {/* IFSC Code */}
            <div className="flex items-center border border-gray-300 rounded-xl bg-[#F9FAFB] focus-within:ring-2 focus-within:ring-[#FFD369]">
              <span className="px-3 text-gray-500">
                <FaUniversity />
              </span>
              <input
                type="text"
                name="ifsc_code"
                required
                placeholder="Enter IFSC Code"
                value={formData.bank_details.ifsc_code}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    bank_details: {
                      ...prev.bank_details,
                      ifsc_code: e.target.value,
                    },
                  }))
                }
                className="w-full py-3 bg-transparent outline-none text-gray-800 placeholder:text-gray-400 rounded-r-xl"
              />
            </div>
            {/* Account Holder Name*/}
            <div className="flex items-center border border-gray-300 rounded-xl bg-[#F9FAFB] focus-within:ring-2 focus-within:ring-[#FFD369]">
              <span className="px-3 text-gray-500">
                <FaUser />
              </span>
              <input
                type="text"
                name="account_holder_name"
                maxLength={30}
                required
                placeholder="Account Holder Name"
                value={formData.bank_details.account_holder_name}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    bank_details: {
                      ...prev.bank_details,
                      account_holder_name: e.target.value,
                    },
                  }))
                }
                className="w-full py-3 bg-transparent outline-none text-gray-800 placeholder:text-gray-400 rounded-r-xl"
              />
            </div>
            {/* Account Number*/}
            <div className="flex items-center border border-gray-300 rounded-xl bg-[#F9FAFB] focus-within:ring-2 focus-within:ring-[#FFD369]">
              <span className="px-3 text-gray-500">
                <FaUser />
              </span>
              <input
                type="text"
                name="account_number"
                maxLength={30}
                required
                placeholder="Account Number"
                value={formData.bank_details.account_number}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    bank_details: {
                      ...prev.bank_details,
                      account_number: e.target.value,
                    },
                  }))
                }
                className="w-full py-3 bg-transparent outline-none text-gray-800 placeholder:text-gray-400 rounded-r-xl"
              />
            </div>
            {/* UPI Id */}
            <div className="relative">
              <label className="text-sm px-3 font-medium text-gray-600 block mb-1">
                Optional
              </label>
              <div className="flex items-center border border-gray-300 rounded-xl bg-[#F9FAFB] focus-within:ring-2 focus-within:ring-[#FFD369]">
                <span className="px-3 text-gray-500">
                  <FiCreditCard />
                </span>
                <input
                  type="text"
                  name="upi_id"
                  placeholder="UPI ID"
                  value={formData.bank_details.upi_id}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      bank_details: {
                        ...prev.bank_details,
                        upi_id: e.target.value,
                      },
                    }))
                  }
                  className="w-full py-3 bg-transparent outline-none text-gray-800 placeholder:text-gray-400 rounded-r-xl"
                />
              </div>
            </div>
          </>
        )}
        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-[#111827] text-white text-lg font-semibold hover:bg-[#f8d37e] hover:text-[#111827] transition-all duration-300 ease-in-out cursor-pointer"
        >
          {loading
            ? "Processing..."
            : step === 6
            ? "Complete Registration"
            : "Next"}
        </button>

        {/* Hint */}
        <p className="text-xs text-gray-500 text-center pt-2">
          Already have an account?{" "}
          <span className="text-blue-500 hover:underline cursor-pointer" onClick={()=>{navigate("/login")}}>
            Login here
          </span>
        </p>
      </form>
    </div>
  );
};

export default SalonSignUpForm;
