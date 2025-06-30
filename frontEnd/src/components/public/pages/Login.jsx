import {motion} from 'motion/react';
import {toast} from 'react-hot-toast'
import { FaLock, FaUser, FaGoogle, FaTemperatureLow } from "react-icons/fa";
import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { loginSuccess} from '../authSlice';
import requestHandler from '../../../utils/requestHandler';


import salonServices from '../../../services/salon/salonServices';
import {authServices as customerAuthServices}  from '../../../services/customer/index';
const Login = () => { 
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const brandName = useSelector(state => state.auth.brandName); 
  const [user, setUser] = useState({ email: "", password: "" });
  const [role, setRole] = useState("customer");

  const handleLogin = async(e) => {
    e.preventDefault();
      if (!role || !user.email || !user.password) {
        toast.error("Please fill in all fields.");
        return;
      }
      const {email, password} = user;
      if(role=='salon'){
        await requestHandler(dispatch, ()=> salonServices.login(email, password),1,{
          onSuccess : (res) =>{
            dispatch(loginSuccess({ role: 'salon', isAuthenticated: true}));
            navigate("/salon");
          }
        })
      }
      if(role=='customer'){
        await requestHandler(dispatch, ()=> customerAuthServices.login(email, password),1,{
          onSuccess: (res) =>{
            dispatch(loginSuccess({role: 'customer', isAuthenticated: true}));
            navigate("/customer");
          }
        });
      }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-md"
      >
        {/* Header */}
        <div
          className="bg-[#1F2937] text-white text-center py-10 px-6"
          style={{
            backgroundImage: "url('/images/login-bg.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundBlendMode: 'multiply',
          }}
          
        >
          <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
          <p className="text-[#E5E7EB]">Login to your {brandName} dashboard</p>
        </div>
          {/* Role Toggle */}
        <div className="flex justify-center gap-4 mb-6 mt-6">
          <button
            onClick={() => setRole("customer")}
            className={`px-4 py-2 rounded-md font-semibold cursor-pointer ${
              role === "customer"
                ? "bg-[#FFD369] text-[#111827]"
                : "bg-[#E5E7EB] text-[#374151]"
            }`}
          >
            Customer
          </button>
          <button
            onClick={() => setRole("salon")}
            className={`px-4 py-2 rounded-md font-semibold cursor-pointer ${
              role === "salon"
                ? "bg-[#FFD369] text-[#111827]"
                : "bg-[#E5E7EB] text-[#374151]"
            }`}
          >
            Salon
          </button>
        </div>
        {/* Form */}
        <div className="px-8">
          <form className="space-y-6" onSubmit={handleLogin}>
            {/* Username */}
            <div className="relative">
              <FaUser className="absolute top-3 left-3 text-[#94A3B8]" />
              <input
                type="email"
                placeholder="Enter Email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-[#E5E7EB] rounded-md bg-[#F9FAFB] text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#FFD369]"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <FaLock className="absolute top-3 left-3 text-[#94A3B8]" />
              <input
                type="password"
                placeholder="Enter Password"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-[#E5E7EB] rounded-md bg-[#F9FAFB] text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#FFD369]"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-[#1F2937] hover:bg-[#FFD369] hover:text-[#111827] text-white py-3 rounded-md transition-all duration-300 font-medium cursor-pointer"
            >
              Login
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <hr className="flex-1 border-[#E5E7EB]" />
              <span className="text-sm text-[#94A3B8]">or</span>
              <hr className="flex-1 border-[#E5E7EB]" />
            </div>

            {/* Google Login */}
            <button
              type="button"
              onClick={() => toast("Google login not yet implemented.")}
              className="w-full flex items-center justify-center gap-3 border border-[#E5E7EB] py-3 rounded-md hover:bg-[#E5E7EB] transition"
            >
              <FaGoogle className="text-[#FFD369]" />
              <span className="text-[#111827] font-medium">Login with Google</span>
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center text-sm text-[#94A3B8]">
            <p>
              Forgot your password?{" "}
              <Link to="/resetPassword" className="text-[#FFD369] font-medium hover:underline">
                Reset here
              </Link>
            </p>
            <p className="mt-2">
              New to ${brandName}?{" "}
              <Link to = '/SignUp' className="text-[#FFD369] font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
