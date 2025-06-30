import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { FaCheckCircle, FaImages,FaCamera,FaTrash,FaPlus,FaClock,FaMoneyBillWave,FaUserTie,FaStar,FaInstagram} from "react-icons/fa";
import { MdVerifiedUser, MdEdit,MdSchedule,MdOutlineHomeRepairService} from "react-icons/md";
import { RiMapPinLine, RiCustomerService2Fill } from "react-icons/ri";
import { FiEdit, FiUpload } from "react-icons/fi";
import salonServices from "../../../services/salon/salonServices";
import requestHandler from "../../../utils/requestHandler";
import { setProfile } from "../salonSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.salon.profile);
  const [isEditing, setIsEditing] = useState(false);
 // Initial state setup
const [workingDetails, setWorkingDetails] = useState({
  operating_hours: profile?.operating_hours || {
    '0': { opening: "09:00", closing: "20:00", is_open: true },
    '1': { opening: "09:00", closing: "20:00", is_open: true },
    '2': { opening: "09:00", closing: "20:00", is_open: true },
    '3': { opening: "09:00", closing: "20:00", is_open: true },
    '4': { opening: "09:00", closing: "20:00", is_open: true },
    '5': { opening: "09:00", closing: "20:00", is_open: true },
    '6': { opening: "09:00", closing: "20:00", is_open: true }
  }
});

// Handlers
const handleDayToggle = (dayId) => {
  setWorkingDetails(prev => ({
    ...prev,
    operating_hours: {
      ...prev.operating_hours,
      [dayId]: {
        ...prev.operating_hours[dayId],
        is_open: !prev.operating_hours[dayId].is_open
      }
    }
  }));
};

const handleTimeChange = (dayId, field, value) => {
  setWorkingDetails(prev => ({
    ...prev,
    operating_hours: {
      ...prev.operating_hours,
      [dayId]: {
        ...prev.operating_hours[dayId],
        [field]: value
      }
    }
  }));
};


  // Handle file uploads
  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file?.type.startsWith("image/")) {
      toast.error("Please select a valid image file (JPG, PNG, etc.)");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image too large. Please upload a file smaller than 2MB.");
      return;
    }

    const service = type === 'banner' ? salonServices.changeBannerPhoto : salonServices.changeProfilePhoto;
    const field = type === 'banner' ? 'banner' : 'profile_image';

    await requestHandler(
      dispatch,
      () => service(file),
      1,
      {
        onSuccess: (res) => {
          dispatch(setProfile({ 
            profile: { ...profile, [field]: res.data.data.newProfileLink } 
          }));
        },
      }
    );
  };

  // Handle gallery photo upload
  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.some(file => !file.type.startsWith("image/"))) {
      toast.error("Please select valid image files only");
      return;
    }
    if (files.some(file => file.size > 2 * 1024 * 1024)) {
      toast.error("Some images are too large (max 2MB each)");
      return;
    }

    await requestHandler(
      dispatch,
      () => salonServices.uploadGalleryPhotos(files),
      1,
      {
        onSuccess: (res) => {
          dispatch(setProfile({ 
            profile: { ...profile, photos: [...(profile.photos || []), ...res.data.data.newPhotos] } 
          }));
          toast.success(`${files.length} photos added to gallery`);
        },
      }
    );
  };

  // Delete gallery photo
  const deleteGalleryPhoto = async (photoUrl) => {
    await requestHandler(
      dispatch,
      () => salonServices.deleteGalleryPhoto(photoUrl),
      1,
      {
        onSuccess: () => {
          dispatch(setProfile({ 
            profile: { 
              ...profile, 
              photos: profile.photos.filter(p => p !== photoUrl) 
            } 
          }));
          toast.success("Photo removed from gallery");
        },
      }
    );
  };

  // Handle working details change
  const handleWorkingDetailsChange = async (e) => {
    const { name, value, checked } = e.target;
    if (name.includes("working_days")) {
      const dayNumber = Number(name.split("s")[1]);
      setWorkingDetails(prev => ({
        ...prev,
        working_days: checked 
          ? [...prev.working_days, dayNumber]
          : prev.working_days.filter(d => d !== dayNumber)
      }));
    } else {
      setWorkingDetails(prev => ({ ...prev, [name]: value }));
    }
  };

  // Format time display
  const formatTime = (timeStr) => {
    if (!timeStr) return "Not Set";
    const [hour, minute] = timeStr.split(":").map(Number);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minute.toString().padStart(2, "0")} ${ampm}`;
  };

  // Days of week
  const days = [
    { id: 0, name: "Sunday" },
    { id: 1, name: "Monday" },
    { id: 2, name: "Tuesday" },
    { id: 3, name: "Wednesday" },
    { id: 4, name: "Thursday" },
    { id: 5, name: "Friday" },
    { id: 6, name: "Saturday" },
  ];
  const operatingHoursArray = profile.operating_hours 
  ? Object.values(profile.operating_hours).map((day, index) => ({
      ...day,
      dayName: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][index]
    }))
  : [];

  // Update working details
  const updateWorkingDetails = async () => {
    const filter = {
      ...(workingDetails.opening_hour && { opening_hour: workingDetails.opening_hour }),
      ...(workingDetails.closing_hour && { closing_hour: workingDetails.closing_hour }),
      ...(workingDetails.length > 0 && { working_days: workingDetails.working_days })
    };

    await requestHandler(
      dispatch,
      () => salonServices.updateWorkingDetails(filter),
      1,
      {
        onSuccess: async () => {
          const res = await requestHandler(
            dispatch, 
            () => salonServices.getProfile(),
            0
          );
          dispatch(setProfile({ profile: res.data.data[0] }));
          setIsEditing(false);
          toast.success("Working hours updated successfully");
        }
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter']">
      {/* Banner Section */}
      <div className="relative h-64 w-full bg-gray-200 overflow-hidden">
        {profile?.banner ? (
          <div className="relative h-full w-full group">
            <img
              src={`http://localhost:8000/api/photos/${profile.banner}`}
              alt="Salon Banner"
              className="w-full h-full rounded-2xl object-fit  "
            />
            <label
              htmlFor="banner-upload"
              className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <span className="text-white flex items-center gap-2 px-4 py-2 bg-black/50 rounded-full">
                <FaCamera className="text-lg" />
                Change Banner
              </span>
            </label>
          </div>
        ) : (
          <label
            htmlFor="banner-upload"
            className="h-full w-full flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100 cursor-pointer"
          >
            <div className="text-center p-6">
              <FaImages className="mx-auto text-4xl text-gray-400 mb-2" />
              <p className="text-gray-500">Upload Salon Banner</p>
              <p className="text-sm text-gray-400">Recommended size: 1200x400px</p>
            </div>
          </label>
        )}
        <input
          id="banner-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileUpload(e, 'banner')}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-16 relative z-10">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="px-8 pt-8 pb-4">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Profile Picture */}
              <div className="relative -mt-8">
                <div className="relative group">
                  {profile?.profile_image ? (
                    <>
                      <img
                        src={`http://localhost:8000/api/photos/${profile.profile_image}`}
                        alt="Profile"
                        className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                      <label
                        htmlFor="profile-upload"
                        className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <FiEdit className="text-white text-xl" />
                      </label>
                    </>
                  ) : (
                    <label
                      htmlFor="profile-upload"
                      className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50"
                    >
                      <FiUpload className="text-gray-400 text-xl" />
                    </label>
                  )}
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'profile')}
                  />
                </div>
                <div className="absolute -bottom-3 right-0 bg-white px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                  <FaCheckCircle className="text-blue-500" />
                  <span className="text-sm font-medium">
                    {profile?.experience}+ Years
                  </span>
                </div>
              </div>

              {/* Salon Info */}
              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
                      {profile?.salon_name}
                      {profile?.is_verified && (
                        <MdVerifiedUser className="ml-2 text-blue-500" />
                      )}
                    </h1>
                    <div className="flex items-center mt-2 text-gray-600">
                      <RiMapPinLine className="mr-2 text-gray-400" />
                      <address className="not-italic">{profile?.full_address}</address>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                  >
                    <MdEdit />
                    <span>Edit Profile</span>
                  </button>
                </div>

                <p className="text-gray-600">{profile?.bio}</p>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatBlock 
                    icon={<RiCustomerService2Fill className="text-blue-500" />}
                    label="Services" 
                    value={profile?.services?.length || 0} 
                  />
                  <StatBlock 
                    icon={<FaMoneyBillWave className="text-green-500" />}
                    label="Price Range" 
                    value={`₹${profile?.average_price_range?.min || 0}-₹${profile?.average_price_range?.max || 0}`} 
                  />
                  <StatBlock 
                    icon={<MdSchedule className="text-purple-500" />}
                    label="Experience" 
                    value={`${profile?.experience || 0} yrs`} 
                  />
                  <StatBlock 
                    icon={<FaStar className="text-yellow-400" />}
                    label="Rating" 
                    value={`${profile?.rating || 'New'} (${profile?.rating_count || 0})`} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Gallery Section */}
          <div className="px-8 py-6 border-t border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FaImages className="text-blue-500" />
                Salon Gallery
              </h2>
              <label className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                <FaPlus />
                <span>Add Photos</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleGalleryUpload}
                />
              </label>
            </div>
            
            {profile?.photos?.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {profile.photos.map((photo, index) => (
                  <div key={index} className="relative group aspect-square">
                    <img
                      src={`http://localhost:8000/api/photos/${photo}`}
                      alt={`Salon photo ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      onClick={() => deleteGalleryPhoto(photo)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <FaImages className="mx-auto text-4xl text-gray-400 mb-2" />
                <p className="text-gray-500">No photos added yet</p>
                <label className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer">
                  Upload Photos
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleGalleryUpload}
                  />
                </label>
              </div>
            )}
          </div>

          {/* Working Hours Section */}
          <div className="px-8 py-6 border-t border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <MdSchedule className="text-blue-500" />
                Working Hours
              </h2>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {isEditing ? (
              <div className="space-y-4">
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Working Days & Hours
    </label>
    <div className="space-y-3">
      {days.map(day => (
        <div key={day.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3 bg-gray-50 rounded-lg">
          <label className="flex items-center space-x-2 min-w-[120px]">
            <input
              type="checkbox"
              checked={workingDetails.operating_hours[day.id].is_open}
              onChange={() => handleDayToggle(day.id)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="font-medium">{day.name}</span>
          </label>
          
          {workingDetails.operating_hours[day.id].is_open && (
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Opening Time</label>
                <input
                  type="time"
                  value={workingDetails.operating_hours[day.id].opening}
                  onChange={(e) => handleTimeChange(day.id, 'opening', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Closing Time</label>
                <input
                  type="time"
                  value={workingDetails.operating_hours[day.id].closing}
                  onChange={(e) => handleTimeChange(day.id, 'closing', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>

  <div className="flex justify-end space-x-3 pt-4">
    <button
      onClick={() => setIsEditing(false)}
      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
    >
      Cancel
    </button>
    <button
      onClick={updateWorkingDetails}
      className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Save Changes</button>
  </div>
</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
  {operatingHoursArray.map((day) => (
    <motion.div
      key={day._id}
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
            )}
          </div>

          {/* Services Section */}
          {profile?.services?.length > 0 && (
            <div className="px-8 py-6 border-t border-gray-100">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MdOutlineHomeRepairService className="text-blue-500" />
                Services Offered
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.services.map((service, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="font-bold text-lg text-gray-800">{service.serviceDetails?.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{service.serviceDetails?.category}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-4">
                        <span className="flex items-center text-sm text-blue-500">
                          <FaClock className="mr-1" /> {service.estimated_duration} min
                        </span>
                        <span className="flex items-center text-sm text-pink-500">
                          <FaVenusMars className="mr-1" /> {service.gender}
                        </span>
                      </div>
                      <span className="font-bold text-green-600 flex items-center">
                        <FaRupeeSign className="mr-1" /> {service.price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bank Details Section */}
          <div className="px-8 py-6 border-t border-gray-100">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaMoneyBillWave className="text-blue-500" />
              Bank Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <StatBlock
                label="Account Holder"
                value={profile?.bank_details?.account_holder_name}
              />
              <StatBlock
                label="Account Number"
                value={profile?.bank_details?.account_number}
              />
              <StatBlock
                label="Bank Name"
                value={profile?.bank_details?.bank_name}
              />
              <StatBlock
                label="IFSC Code"
                value={profile?.bank_details?.ifsc_code}
              />
              <StatBlock 
                label="UPI ID" 
                value={profile?.bank_details?.upi_id} 
              />
            </div>
          </div>

          {/* Social Links Section */}
          <div className="px-8 py-6 border-t border-gray-100">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <RiCustomerService2Fill className="text-blue-500" />
              Connect With Us
            </h2>
            <div className="flex flex-wrap gap-4">
              {profile?.social_links?.map((link, i) => (
                link.link && (
                  <a
                    key={i}
                    href={link.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    {link.platform === 'instagram' && <FaInstagram className="text-pink-500" />}
                    {link.platform === 'facebook' && <FaFacebookF className="text-blue-600" />}
                    {link.platform === 'website' && <FaGlobe className="text-gray-700" />}
                    <span>{link.platform}</span>
                  </a>
                )
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced StatBlock component
const StatBlock = ({ icon, label, value, valueColor = "text-gray-800" }) => (
  <div className="bg-gray-50 p-3 rounded-lg">
    <div className="flex items-center gap-2">
      {icon && <span className="text-lg">{icon}</span>}
      <span className="text-xs text-gray-500">{label}</span>
    </div>
    <span className={`${valueColor} font-medium block truncate`}>
      {value || "Not provided"}
    </span>
  </div>
);

export default Profile;