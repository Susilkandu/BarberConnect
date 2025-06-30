import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import requestHandler from '../../../utils/requestHandler';
import salonServices from '../../../services/salon/salonServices';

export default function Bookings() {
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookings, setBookings] = useState([]);

  const BookingsFetcher = async () => {
    await requestHandler(dispatch, () => salonServices.getBookings(selectedDate), 0, {
      onSuccess: (res) => {
        const dataObj = res.data.data;
        const dataArr = Array.isArray(dataObj) ? dataObj : Object.values(dataObj);
        setBookings(dataArr);
      },
      onError: (res) => {
        setBookings([]);
      }
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      await BookingsFetcher();
    };
    fetchData();
  }, [selectedDate]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-900">Bookings</h2>

      <div className="mb-6 flex justify-center">
        <input
          type="date"
          value={selectedDate.toISOString().split('T')[0]}
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
          className="border border-gray-300 rounded px-4 py-2 text-gray-700 shadow"
        />
      </div>

      <div className="space-y-4">
        {bookings.length === 0 ? (
          <p className="text-center text-gray-500">No bookings for this date.</p>
        ) : (
          bookings.map((booking) => (
            <div
              key={booking._id}
              className="border rounded-lg shadow p-4 bg-white hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  {booking.name}
                </h3>
                <span className={`text-sm px-2 py-1 rounded ${
                  booking.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {booking.status}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-1">
                <strong>Total Price:</strong> ₹{booking.total_price}
              </p>

              <p className="text-sm text-gray-600 mb-1">
                <strong>Payment Mode:</strong> {booking.paymentMode} — 
                <span className={`ml-2 text-xs px-2 py-1 rounded ${
                  booking.paymentStatus === 'pending'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-green-100 text-green-700'
                }`}>
                  {booking.paymentStatus}
                </span>
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Date:</strong>{' '}
                {new Date(booking.starting_time_slot).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Time Slot:</strong>{' '}
                {new Date(booking.starting_time_slot).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}{' '}
                -{' '}
                {new Date(booking.ending_time_slot).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>

              <div className="mt-2">
                <strong className="text-sm text-gray-700">Services:</strong>
                <ul className="list-disc pl-6 text-sm text-gray-600 mt-1">
                  {booking.required_services.map((service) => (
                    <li key={service._id}>
                      {service.gender} – ₹{service.price} ({service.estimated_duration} min)
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
