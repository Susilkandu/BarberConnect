import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import publicServices from "../../../services/public/publicServices";
import requestHandler from "../../../utils/requestHandler";
import { motion, AnimatePresence } from "framer-motion";
import { FaMapMarkerAlt, FaStar, FaClock, FaVenusMars, FaRupeeSign, FaUserTie } from "react-icons/fa";
import { MdVerified, MdOutlineHomeRepairService, MdSchedule } from "react-icons/md";
import { TbRazor } from "react-icons/tb";
import { RiCustomerService2Fill } from "react-icons/ri";

const ViewSalonProfile = () => {
  const { salon_id } = useParams();
  const [salon, setSalon] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSalons = async () => {
      setIsLoading(true);
      await requestHandler(
        dispatch,
        () => publicServices.viewSalonProfile(new URLSearchParams({ salon_id }).toString()),
        0,
        {
          onSuccess: (res) => {
            setSalon(res.data.data);
            setIsLoading(false);
          },
          onError: () => setIsLoading(false)
        }
      );
    };
    fetchSalons();
  }, [salon_id]);

  const handleServiceSelection = (service) => {
    setSelectedServices(prev => 
      prev.some(s => s._id === service._id) 
        ? prev.filter(s => s._id !== service._id)
        : [...prev, service]
    );
  };

  const formatTime = (time) => {
    if (!time) return 'Closed';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    return `${hour > 12 ? hour - 12 : hour}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`;
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-4 border-t-blue-500 border-r-blue-300 border-b-blue-200 border-l-blue-400 rounded-full"
      />
    </div>
  );

  if (!salon) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center p-8 max-w-md">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Salon Not Found</h2>
        <p className="text-gray-500 mb-6">We couldn't find the salon you're looking for.</p>
        <Link to="/" className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all">
          Browse Salons
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section with Banner */}
      <div className="relative h-64 w-full overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600">
        {salon.banner && (
          <motion.img
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            src={`http://localhost:8000/api/photos/${salon.banner}`}
            alt="Salon Banner"
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        {/* Salon Card */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl shadow-xl overflow-hidden"
        >
          {/* Salon Header */}
          <div className="relative px-8 pt-8 pb-4">
            <div className="flex items-start gap-6">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="relative -mt-8"
              >
                <img
                  src={salon.profile_image ? `http://localhost:8000/api/photos/${salon.profile_image}` : "/default-salon.jpg"}
                  alt="Salon"
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
                {salon.verified_by_admin && (
                  <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-1 rounded-full">
                    <MdVerified className="text-xl" />
                  </div>
                )}
              </motion.div>

              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">{salon.salon_name}</h1>
                <div className="flex items-center mt-2 text-gray-600">
                  <FaMapMarkerAlt className="mr-2 text-red-400" />
                  <p>{salon.full_address}</p>
                </div>
                <div className="flex items-center mt-3 space-x-4">
                  <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span className="font-medium">{salon.rating || "New"}</span>
                    <span className="text-gray-500 ml-1">({salon.rating_count || 0})</span>
                  </div>
                  <div className="bg-green-50 px-3 py-1 rounded-full text-green-700 font-medium">
                    {salon.experience}+ years
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="px-8 py-6 border-t border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">About Us</h2>
            <p className="text-gray-600 leading-relaxed">{salon.bio || "No description provided."}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-8 py-4 bg-gray-50">
            {[
              { icon: <RiCustomerService2Fill className="text-blue-500" />, label: "Services", value: salon.services?.length || 0 },
              { icon: <FaRupeeSign className="text-green-500" />, label: "Price Range", value: `₹${salon.average_price_range?.min}-₹${salon.average_price_range?.max}` },
              { icon: <MdSchedule className="text-purple-500" />, label: "Experience", value: `${salon.experience} yrs` },
              { icon: <FaUserTie className="text-orange-500" />, label: "Owner", value: salon.owner_name?.first_name },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -3 }}
                className="bg-white p-3 rounded-lg shadow-sm text-center"
              >
                <div className="text-2xl mb-1 flex justify-center">{stat.icon}</div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="font-semibold">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Operating Hours */}
          <div className="px-8 py-6 border-t border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <MdSchedule className="text-blue-500 mr-2" /> Operating Hours
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {salon.operating_hours?.map((day) => (
                <motion.div
                  key={day.day}
                  whileHover={{ scale: 1.02 }}
                  className={`p-3 rounded-lg border ${day.is_open ? 'border-green-100 bg-green-50' : 'border-gray-100 bg-gray-50'}`}
                >
                  <h3 className="font-semibold">{day.dayName}</h3>
                  <p className={day.is_open ? "text-green-600" : "text-gray-400"}>
                    {day.is_open ? `${formatTime(day.opening)} - ${formatTime(day.closing)}` : "Closed"}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="px-8 py-6 border-t border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <MdOutlineHomeRepairService className="text-blue-500 mr-2" /> Services
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {salon.services?.map((service) => (
                <motion.div
                  key={service._id}
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`relative bg-white rounded-xl p-4 border ${selectedServices.some(s => s._id === service._id) ? 'border-blue-300 ring-2 ring-blue-100' : 'border-gray-200'}`}
                >
                  <h3 className="font-bold text-lg text-gray-800">{service.serviceDetails.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{service.serviceDetails.category}</p>
                  <p className="text-gray-600 text-sm mb-4">{service.serviceDetails.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-3">
                      <span className="flex items-center text-sm text-blue-500">
                        <FaClock className="mr-1" /> {service.estimated_duration} min
                      </span>
                      <span className="flex items-center text-sm text-pink-500">
                        <FaVenusMars className="mr-1" /> {service.gender}
                      </span>
                    </div>
                    <span className="font-bold text-green-600 flex items-center">
                      <FaRupeeSign /> {service.price}
                    </span>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleServiceSelection(service)}
                    className={`absolute -top-3 -right-3 text-sm px-4 py-1 rounded-full font-medium ${selectedServices.some(s => s._id === service._id) ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    {selectedServices.some(s => s._id === service._id) ? "Selected" : "Select"}
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Booking CTA */}
          <AnimatePresence>
            {selectedServices.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="px-8 py-6 bg-blue-50 border-t border-blue-100"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-800">Ready to book?</h3>
                    <p className="text-sm text-gray-600">
                      {selectedServices.length} service{selectedServices.length > 1 ? 's' : ''} selected
                    </p>
                  </div>
                  <Link
                    to={`/customer/bookNow/${salon._id}`}
                    state={{ selectedServices }}
                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:shadow-lg transition-all"
                  >
                    Continue Booking
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default ViewSalonProfile;