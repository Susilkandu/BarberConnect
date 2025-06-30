import React from 'react';
import { useLocation } from 'react-router-dom';
import { FaCheckCircle, FaDownload, FaCalendarAlt, FaClock, FaRupeeSign, FaUser } from 'react-icons/fa';
import generatePdfInvoice from '../../../../utils/generatePDFInvoice';

export default function BookingSuccess() {
  const location = useLocation();
  const { data } = location.state || {};

  if (!data) {
    return <p className="text-center text-red-500 mt-10">No booking data received.</p>;
  }

  const handleDownload = () => {
    generatePdfInvoice(data);
  };

  // Calculating Total Price and Total Duration
  const totalPrice = data.required_services.reduce((sum, item) => sum + item.price, 0);
  const totalDuration = data.required_services.reduce((sum, item) => sum + item.estimated_duration, 0);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] p-4">
      <div className="bg-white shadow-xl rounded-xl p-6 sm:p-8 max-w-lg w-full border border-[#E5E7EB]">
        {/* Success Icon */}
        <div className="text-center mb-6">
          <FaCheckCircle className="text-green-500 mx-auto mb-2" size={60} />
          <h2 className="text-2xl font-bold text-[#1F2937]">✨ Booking Confirmed ✨</h2>
          <p className="text-[#111827] text-sm mt-2">Thank you <span className="font-semibold">{data.name}</span> 🩶</p>
        </div>

        {/* Salon & Customer Info */}
        <div className="text-sm text-[#111827] mb-4 space-y-1">
          <div className="flex items-center gap-2">
            <FaUser className="text-[#94A3B8]" />
            <p><span className="font-semibold">Customer:</span> {data.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="text-[#94A3B8]" />
            <p><span className="font-semibold">Salon:</span> {data.salon_name}</p>
          </div>
          <div className="flex items-center gap-2">
            <FaClock className="text-[#94A3B8]" />
            <p><span className="font-semibold">Slot Date:</span> {data.date} </p>
          </div>
          <div className="flex items-center gap-2">
            <FaClock className="text-[#94A3B8]" />
            <p><span className="font-semibold">Slot:</span> {data.starting_time} - {data.ending_time}</p>
          </div>
        </div>

        {/* Service List */}
        <div className="mt-4 border border-[#E5E7EB] rounded-lg overflow-hidden">
          <div className="bg-[#F9FAFB] px-4 py-2 text-left font-semibold text-[#1F2937]">Service Details</div>
          <div className="divide-y divide-[#E5E7EB]">
            {data.required_services.map((service, index) => (
              <div key={index} className="p-4 text-sm text-[#4B5563] flex flex-col sm:flex-row justify-between">
                <div>
                  <p className="font-medium text-[#1F2937]">{service.name}</p>
                  <p className="text-xs text-[#6B7280] capitalize">For: {service.gender}</p>
                  <p className="text-xs text-[#6B7280]">Duration: {service.estimated_duration} mins</p>
                </div>
                <div className="flex items-center gap-1 text-green-600 font-semibold mt-2 sm:mt-0">
                  <FaRupeeSign size={12} /> {service.price}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total Summary */}
        <div className="mt-6 p-4 bg-[#F9FAFB] rounded-lg shadow-inner text-sm text-[#111827] space-y-2">
          <p><span className="font-semibold">Total Services:</span> {data.required_services.length}</p>
          <p><span className="font-semibold">Total Duration:</span> {totalDuration} mins</p>
          <p><span className="font-semibold">Total Price:</span> ₹{totalPrice}</p>
          <p><span className="font-semibold">Payment Mode:</span> {data.paymentMode}</p>
          <p><span className="font-semibold">Status:</span> {data.status.charAt(0).toUpperCase() + data.status.slice(1)}</p>
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          className="mt-6 w-full bg-[#FFD369] hover:bg-yellow-400 text-[#1F2937] font-semibold py-2 rounded-lg shadow transition duration-300 flex items-center justify-center gap-2"
        >
          <FaDownload size={14} />
          Download Invoice
        </button>
      </div>
    </div>
  );
}
