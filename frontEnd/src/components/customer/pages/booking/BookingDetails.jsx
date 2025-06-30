import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import bookingServices from '../../../../services/customer/booking';
import requestHandler from '../../../../utils/requestHandler';
import { AiOutlineCalendar, AiOutlineClockCircle } from 'react-icons/ai';
import { FaRupeeSign } from 'react-icons/fa';
import { MdPending, MdDone, MdCancel } from 'react-icons/md';
import generatePDFInvoice from '../../../../utils/generatePDFInvoice';

export default function BookingDetails() {
    const dispatch = useDispatch();
    const location = useLocation();
    const { booking_id } = location.state || {};
    const [details, setDetails] = useState(null);

    const fetchBookingDetails = async (booking_id) => {
        await requestHandler(dispatch, () => bookingServices.getBookingDetails(booking_id), 0, {
            onSuccess: (res) => setDetails(res.data.data),
        });
    };

    useEffect(() => {
        if (booking_id) fetchBookingDetails(booking_id);
    }, [booking_id]);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <MdPending className="text-yellow-500" size={22} />;
            case 'completed': return <MdDone className="text-green-600" size={22} />;
            case 'cancelled': return <MdCancel className="text-red-500" size={22} />;
            default: return null;
        }
    };

    if (!details) {
        return <div className="text-center text-gray-400 py-20 text-lg animate-pulse">Fetching your booking details...</div>;
    }

    return (
        <div className="p-4 max-w-lg mx-auto mt-6">
            <div className="bg-gradient-to-tr from-indigo-50 to-indigo-100 rounded-3xl shadow-xl p-6 space-y-6 border border-indigo-200 hover:shadow-2xl transition-shadow duration-500">
                <h2 className="text-2xl font-bold text-indigo-700 text-center mb-2">Your Booking Summary</h2>

                <div className="space-y-3 text-gray-700">
                    <InfoRow label="Booking Date" value={new Date(details.bookingDate).toLocaleDateString()} icon={<AiOutlineCalendar size={20} />} />
                    <InfoRow label="Time Slot" value={
                        `${new Date(details.starting_time_slot).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                        ${new Date(details.ending_time_slot).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                    } icon={<AiOutlineClockCircle size={20} />} />
                    <InfoRow label="Total Amount" value={`₹${details.total_price}`} icon={<FaRupeeSign size={18} />} highlight />
                    <InfoRow label="Status" value={details.status} icon={getStatusIcon(details.status)} uppercase />
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-indigo-700 mt-4 mb-2">Booked Services</h3>
                    <div className="space-y-3">
                        {details.services.map((service, index) => (
                            <div key={`${service.service_info._id}-${index}`} className="p-3 rounded-xl bg-white shadow hover:scale-[1.02] hover:shadow-lg transition-all duration-300 border border-gray-200">
                                <span className="text-gray-800 font-medium">{service.service_info.name}</span>
                                <span className="text-gray-600 text-sm block mt-1">{service.service_info.description}</span>
                                <div className="flex justify-between text-sm text-gray-700 mt-2">
                                    <span>Duration: {service.estimated_duration} mins</span>
                                    <span className="flex items-center gap-1"><FaRupeeSign size={12} /> {service.price}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <button className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl shadow-md hover:shadow-xl transition-all duration-300" >
                    Download Invoice
                </button>
            </div>
        </div>
    );
}

const InfoRow = ({ label, value, icon, highlight, uppercase }) => (
    <div className="flex justify-between items-center">
        <span className="font-medium flex items-center gap-1">{icon} {label}</span>
        <span className={`flex items-center gap-1 ${highlight ? 'text-indigo-700 font-bold' : 'text-gray-700'} ${uppercase ? 'uppercase' : ''}`}>
            {value}
        </span>
    </div>
);
