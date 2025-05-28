import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { FaUser, FaEnvelope, FaLock, FaCheckCircle } from "react-icons/fa";
import { authServices } from "../../../services/customer/index";
import requestHandler from "../../../utils/requestHandler";

const CustomerSignupForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setFormData((prev) => ({
        ...prev,
        location_coordinates: {
          coordinates: [longitude, latitude],
        },
      }));
    });
    if (Cookies.get("customerToken")) {
      (async () => {
        await requestHandler(
          dispatch,
          () => authServices.getRegistrationStep(),
          {
            onSuccess: (res) => {
              setFormData((prev) => ({ ...prev, step: res.data.data.step }));
            },
          }
        );
      })();
    }
  }, []);

  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    name: "",
    gender: "",
    phone: "",
    dob: "",
    password: "",
    location_coordinates: {
      coordinates: [0, 0],
    },
    step: 1.0,
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    const {
      step,
      email,
      otp,
      name,
      gender,
      phone,
      dob,
      password,
      location_coordinates,
    } = formData;
    e.preventDefault();
    try {
      switch (step) {
        case 1.0: {
          if (!email) {
            toast.error("Please Enter the Email");
            return;
          }
          await requestHandler(
            dispatch,
            () => authServices.sendOtpOnEmai({ email }),
            {
              onSuccess: (res) => {
                setFormData((prev) => ({ ...prev, step: 1.1 }));
              },
            }
          );
          break;
        }
        case 1.1: {
          if (!email || otp.length !== 6) {
            toast.error("Please Enter 6 digit OTP");
            return;
          }
          await requestHandler(
            dispatch,
            () => authServices.verifyOtpForReg({ email, otp }),
            {
              onSuccess: (res) => {
                setFormData((prev) => ({ ...prev, step: 2 }));
              },
            }
          );
          break;
        }
        case 2: {
          if (!name) {
            toast.error("Please Enter Name");
            return;
          }
          if (!gender) {
            toast.error("Please Select gender");
            return;
          }
          if (!phone) {
            toast.error("please Enter Phone Number");
            return;
          }
          await requestHandler(
            dispatch,
            () => authServices.saveBasicInfoForReg({ name, gender, phone }),
            {
              onSuccess: (res) => {
                setFormData((prev) => ({ ...prev, step: 3 }));
              },
            }
          );
          break;
        }
        case 3: {
          if (!dob || !password || !location_coordinates) {
            toast.error("Please fill in all the required fields");
            return;
          }
          await requestHandler(
            dispatch,
            () =>
              authServices.saveDobPsdAndLctForReg({
                dob,
                password,
                location_coordinates,
              }),
            {
              onSuccess: (res) => {
                setFormData((prev) => ({ ...prev, step: 4 }));
              },
            }
          );
          break;
        }
        default:
          toast.error("Unknown step");
          break;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 transition-all ease-in-out duration-300"
    >
      {formData.step == 1.0 && (
        <>
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
                placeholder="e.g. john@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full py-3 bg-transparent outline-none text-gray-800 placeholder:text-gray-400 rounded-r-xl"
              />
            </div>
          </div>
        </>
      )}
      {formData.step == 1.1 && (
        <>
          {/* OTP */}
          <div className="relative">
            <label className="text-sm font-medium text-gray-600 block mb-1">
              OTP
            </label>
            <div className="flex items-center border border-gray-300 rounded-xl bg-[#F9FAFB] focus-within:ring-2 focus-within:ring-[#FFD369]">
              <span className="px-3 text-gray-500">
                <FaEnvelope />
              </span>
              <input
                type="text"
                name="otp"
                placeholder="Enter 6 digit OTP"
                value={formData.otp}
                onChange={handleChange}
                className="w-full py-3 bg-transparent outline-none text-gray-800 placeholder:text-gray-400 rounded-r-xl"
              />
            </div>
          </div>
        </>
      )}
      {formData.step == 2 && (
        <>
          {/* name gender password */}
          {/* Full Name */}
          <div className="relative">
            <label className="text-sm font-medium text-gray-600 block mb-1">
              Full Name
            </label>
            <div className="flex items-center border border-gray-300 rounded-xl bg-[#F9FAFB] focus-within:ring-2 focus-within:ring-[#FFD369]">
              <span className="px-3 text-gray-500">
                <FaUser />
              </span>
              <input
                type="text"
                name="name"
                placeholder="e.g. John Doe"
                value={formData.name}
                onChange={handleChange}
                className="w-full py-3 bg-transparent outline-none text-gray-800 placeholder:text-gray-400 rounded-r-xl"
              />
            </div>
          </div>
          {/* Gender */}
          <div className="relative">
            <label className="text-sm font-medium text-gray-600 block mb-1">
              Gender
            </label>
            <div className="flex items-center border border-gray-300 rounded-xl bg-[#F9FAFB] focus-within:ring-2 focus-within:ring-[#FFD369]">
              <span className="px-3 text-gray-500">
                <FaUser />
              </span>
              <select
                className="w-full py-3 bg-transparent outline-none text-gray-800 h-8 placeholder:text-gray-400 rounded-r-xl"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                id="gender"
              >
                <option value="" disabled>
                  Select Gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>
          {/* phone */}
          <div className="relative">
            <label className="text-sm font-medium text-gray-600 block mb-1">
              Phone Number
            </label>
            <div className="flex items-center border border-gray-300 rounded-xl bg-[#F9FAFB] focus-within:ring-2 focus-within:ring-[#FFD369]">
              <span className="px-3 text-gray-500">
                <FaUser />
              </span>
              <input
                className="w-full py-3 bg-transparent outline-none text-gray-800 placeholder:text-gray-400 rounded-r-xl"
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone Number"
                id="phone"
              />
            </div>
          </div>
        </>
      )}

      {formData.step == 3 && (
        <>
          {/* Date of Birth */}
          <div className="relative">
            <label className="text-sm font-medium text-gray-600 block mb-1">
              Choose Date of Birth
            </label>
            <div className="flex items-center border border-gray-300 rounded-xl bg-[#F9FAFB] focus-within:ring-2 focus-within:ring-[#FFD369]">
              <span className="px-3 text-gray-500">
                <FaLock />
              </span>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full py-3 bg-transparent outline-none text-gray-800 placeholder:text-gray-400 rounded-r-xl"
              />
            </div>
          </div>
          {/* Password */}
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
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full py-3 bg-transparent outline-none text-gray-800 placeholder:text-gray-400 rounded-r-xl"
              />
            </div>
          </div>
        </>
      )}
      <div className="flex justify-between space-x-2">
        {formData.step == 4 ? (
          <div className="flex items-center justify-center bg-gradient-to-br  px-4 m-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center animate-fade-in-up">
              <div className="flex justify-center mb-4">
                <FaCheckCircle className="text-green-500 w-16 h-16 animate-pulse" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Account Created Successfully!
              </h1>
              <p className="text-gray-600 mb-6">
                Welcome to{" "}
                <span className="font-semibold text-indigo-600">
                  BarberConnect
                </span>
                . You can now book your favorite barber in just a few clicks!
              </p>
              <Link className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-full shadow-md transition duration-300"
              to={'/'}>
                Go to Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Previous Button */}
            {formData.step > 2 && (
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#111827] text-white text-lg font-semibold hover:bg-[#FFD369] hover:text-[#111827] transition-all duration-300 ease-in-out"
                onClick={() => {
                  setFormData((prev) => ({ ...prev, step: prev.step - 1 }));
                }}
              >
                Previous
              </button>
            )}

            {/* Next */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#111827] text-white text-lg font-semibold hover:bg-[#FFD369] hover:text-[#111827] transition-all duration-300 ease-in-out"
            >
              {formData.step === 3 ? "Submit" : "Next"}
            </button>
          </>
        )}
      </div>

      {/* Hint */}
      <p
        className="text-xs text-gray-500 text-center pt-2"
        onClick={() => {
          navigate("/login");
        }}
      >
        Already have an account?{" "}
        <span className="text-[#FFD369] hover:underline cursor-pointer">
          Login here
        </span>
      </p>
    </form>
  );
};

export default CustomerSignupForm;
