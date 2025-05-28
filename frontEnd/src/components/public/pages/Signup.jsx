import { useState } from "react";
import CustomerSignupForm from "./CustomerSignupForm";
import BarberSignUpForm from "./BarberSignUpForm";

const SignupPage = () => {
  const [role, setRole] = useState("customer");

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] px-4 md:py-10">
      <div className="min-w-screen md:min-w-2/5 bg-white rounded-3xl shadow-2xl max-w-xl p-2">
        <h2 className="text-2xl font-bold text-center mb-6 text-[#1F2937]">Create an Account</h2>

        {/* Role Toggle */}
        <div className="flex justify-center gap-4 mb-6">
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
            onClick={() => setRole("barber")}
            className={`px-4 py-2 rounded-md font-semibold cursor-pointer ${
              role === "barber"
                ? "bg-[#FFD369] text-[#111827]"
                : "bg-[#E5E7EB] text-[#374151]"
            }`}
          >
            Barber
          </button>
        </div>

        {/* Conditional Render */}
        {role === "customer" ? <CustomerSignupForm /> : <BarberSignUpForm />}
      </div>
    </div>
  );
};

export default SignupPage;
