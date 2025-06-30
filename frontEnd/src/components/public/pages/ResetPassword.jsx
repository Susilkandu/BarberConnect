import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate} from "react-router-dom";
import toast from "react-hot-toast";
import requiestHandler from "../../../utils/requestHandler";
import salonServices from "../../../services/salon/salonServices";
import { authServices as customerAuthServices} from "../../../services/customer";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [data, setData] = useState({
    role: "",
    email: "",
    eOtp: "",
    newPassword: "",
    otpSent: false,
  });

  const handleInputChange = (field, value) => {
    if(field=='done'){
      setData({
        role:'',
        email:'',
        eOtp:'',
        newPassword:'',
        otpSent:'false'
      });
      navigate('/login');
    }
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSendOTP = async () => {
    if (!data.email) {
      toast.error("Please enter a valid email");
      return;
    }

    if (data.role === "salon") {
      await requiestHandler(
        dispatch,
        () => salonServices.sendOtpToResetPsd({ email: data.email }),
        {
          onSuccess: (res) => {
            setData((prev) => ({ ...prev, otpSent: true }));
          },
        });
    }else if (data.role === "customer"){
      await requiestHandler(dispatch, ()=> customerAuthServices.sendOtpToResetPsd({email: data.email}),{
        onSuccess: (res) =>{
          setData((prev)=> ({ ...prev, otpSent: true}));
        }
      });
    }
  };

  const handleResetPassword = async () => {
    if (!data.email) {
      toast.error("Please enter a valid email");
      return;
    }
    if (!data.eOtp || data.eOtp.length !== 6) {
      toast.error("Please enter a 6-digit OTP");
      return;
    }
    if (!data.newPassword) {
      toast.error("Please enter a new password");
      return;
    }

    if (data.role === "salon") {
      await requiestHandler(dispatch, () =>
        salonServices.verifyOtpAndUpdatePass({
          email: data.email,
          eOtp: data.eOtp,
          password: data.newPassword,
        }),{
          onSuccess:(res)=>{
            handleInputChange('done','done');
          }
        }
      );
    }else if( data.role == "customer"){
      await requiestHandler(dispatch, () => customerAuthServices.verifyOtpAndUpdatePass({email:data.email, eOtp:data.eOtp, password: data.newPassword}),
      {
        onSuccess: (res)=>{
          handleInputChange('done','done');
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 space-y-6 border border-[#E5E7EB]">
        <h2 className="text-2xl font-bold text-[#111827] text-center">
          Reset Password
        </h2>

        {/* Role Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#111827]">
            Select Role
          </label>
          <select
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#FFD369] bg-[#F9FAFB] border-[#E5E7EB] text-[#111827]"
            value={data.role}
            onChange={(e) => handleInputChange("role", e.target.value)}
          >
            <option value="">Choose</option>
            <option value="salon">Salon</option>
            <option value="customer">Customer</option>
          </select>
        </div>

        {/* Email Input */}
        {data.role && !data.otpSent && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#111827]">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg bg-[#F9FAFB] border-[#E5E7EB] text-[#111827] focus:ring-2 focus:ring-[#FFD369]"
              placeholder="Enter Email Address"
              value={data.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
            <button
              onClick={handleSendOTP}
              className="w-full bg-[#FFD369] text-[#1F2937] font-semibold py-2 rounded-lg hover:opacity-90 transition cursor-pointer"
            >
              Send OTP
            </button>
          </div>
        )}

        {/* OTP and New Password */}
        {data.otpSent && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#111827]">
                Enter OTP
              </label>
              <input
                type="text"
                maxLength={6}
                className="w-full px-4 py-2 border rounded-lg bg-[#F9FAFB] border-[#E5E7EB] text-[#111827] focus:ring-2 focus:ring-[#FFD369]"
                placeholder="Enter 6 digit OTP"
                value={data.eOtp}
                onChange={(e) => handleInputChange("eOtp", e.target.value)}
              />
              <div className="flex justify-end mt-1">
                <span
                  onClick={handleSendOTP}
                  className="text-blue-600 underline text-sm hover:opacity-90 transition cursor-pointer"
                >
                  Resend OTP
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#111827]">
                New Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-lg bg-[#F9FAFB] border-[#E5E7EB] text-[#111827] focus:ring-2 focus:ring-[#FFD369]"
                placeholder="••••••••"
                value={data.newPassword}
                onChange={(e) =>
                  handleInputChange("newPassword", e.target.value)
                }
              />
            </div>

            <button
              onClick={handleResetPassword}
              className="w-full bg-[#1F2937] text-white font-semibold py-2 rounded-lg hover:opacity-90 transition cursor-pointer"
            >
              Reset Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
