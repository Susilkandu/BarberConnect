import React, { useEffect, useState } from 'react';
import { FaClock, FaVenusMars, FaRupeeSign, FaUser } from 'react-icons/fa';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import requestHandler from '../../../../utils/requestHandler';
import bookingServices from '../../../../services/customer/booking';

export default function BookNow() {
  const navigate = useNavigate();
  const { salon_id } = useParams();
  const location = useLocation();
  const { selectedServices } = location.state || {};
  const dispatch = useDispatch();

  const [paymentMethod, setPaymentMethod] = useState('');
  const [name, setName] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);

  const totalDuration = selectedServices?.reduce((total, s) => total + s.estimated_duration, 0);
  const totalCharge = selectedServices?.reduce((total, s) => total + s.price, 0);

  const handleBookingSubmit = async () => {
    console.log(selectedDate)
    if (!paymentMethod || !name || !selectedDate ) {
      alert("Please enter name and select payment method.");
      return;
    }
    const services = selectedServices?.map((s) => s._id);
    const bookingData = { salon_id, name, services, paymentMethod, totalDuration, totalCharge };

    await requestHandler(dispatch, () => bookingServices.bookSlot(
      bookingData.salon_id, bookingData.name, bookingData.services, bookingData.paymentMethod, selectedDate
    ), 1, {
      onSuccess: (res) => navigate("/customer/bookingSuccess", { state: { data: res.data.data } })
    });
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">Confirm Your Booking</h2>

      {selectedServices?.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            {selectedServices.map((service, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white to-indigo-50 border hover:border-indigo-400 rounded-xl p-4 shadow-md hover:shadow-xl transform hover:scale-[1.03] transition-all duration-300 cursor-pointer"
              >
                <h3 className="font-semibold text-gray-800 text-lg truncate">{service.serviceDetails.name}</h3>
                <p className="text-gray-500 text-sm">{service.serviceDetails.category}</p>
                <p className="text-gray-600 text-sm mt-2 line-clamp-2">{service.serviceDetails.description}</p>
                <div className="flex justify-between items-center text-sm mt-4">
                  <span className="flex items-center gap-1 text-blue-600"><FaClock /> {service.estimated_duration} min</span>
                  <span className="flex items-center gap-1 text-pink-500"><FaVenusMars /> {service.gender}</span>
                </div>
                <div className="mt-3 text-green-600 font-bold flex items-center gap-1">
                  <FaRupeeSign /> {service.price}
                </div>
              </div>
            ))}
          </div>

          <div className="mb-8 bg-indigo-50 rounded-xl p-5 border border-indigo-100 shadow-sm">
            <p className="text-lg text-gray-700 mb-2">Total Duration: <span className="font-bold">{totalDuration} mins</span></p>
            <p className="text-lg text-gray-700">Total Charge: <span className="text-green-600 font-bold">₹{totalCharge}</span></p>
          </div>


          <div className="mb-6">
            <label className="block text-gray-600 font-medium mb-1">Customer Name</label>
            <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-indigo-300">
              <span className="px-3 text-gray-400"><FaUser /></span>
              <input
                type="date"
                value={selectedDate}
                min={new Date()}
                onChange={(e) => setSelectedDate(e.target.value)}
                placeholder="Choose Date"
                className="w-full px-3 py-2 outline-none text-gray-700"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-600 font-medium mb-1">Customer Name</label>
            <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-indigo-300">
              <span className="px-3 text-gray-400"><FaUser /></span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-3 py-2 outline-none text-gray-700"
              />
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-gray-600 font-medium mb-1">Payment Method</label>
            <div className="flex gap-4">
              {['online', 'cash'].map((method) => (
                <label
                  key={method}
                  className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg border ${
                    paymentMethod === method ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-white text-gray-700 border-gray-300'
                  } hover:border-indigo-400 transition duration-300`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="hidden"
                  />
                  {method === 'online' ? 'Online' : 'Cash'}
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={handleBookingSubmit}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold shadow-md hover:shadow-xl transition-all duration-300"
          >
            Confirm & Book Now
          </button>
        </>
      ) : (
        <p className="text-center text-gray-400 italic">No services selected yet.</p>
      )}
    </div>
  );
}
