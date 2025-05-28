import React from 'react';
import barberServices from '../../../services/barber/barberServices';
import requestHandler from '../../../utils/requestHandler';
import {toast} from 'react-hot-toast';
import { FaCheckCircle } from 'react-icons/fa';
import { MdVerifiedUser } from 'react-icons/md';
import { RiMapPinLine } from 'react-icons/ri';
import { FiEdit, FiUpload } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

const Profile = () => {
  const dispatch = useDispatch();
  const p = useSelector((state)=>state.barber.profile);

  const profile = p || {
    name: "John Doe",
    email: "john@example.com",
    phone: "1234567890",
    business_name: "Barber King's Lounge",
    location: "Delhi, India",
    location_coordinates: {
      coordinates: [77.216721, 28.644800],
    },
    working_hours: {
      start: "09:00 AM",
      end: "08:00 PM"
    },
    available_days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    average_price_range: { min: 200, max: 1200 },
    experience: 5,
    bio: "Experienced barber offering stylish cuts and shaves with 5+ years in the business.",
    services_offered: ["Haircut", "Shaving", "Beard Trim"],
    rating: 4.7,
    profile_image: "/default-profile.png",
    social_links: [
      { platform: 'instagram', link: 'https://instagram.com' },
      { platform: 'facebook', link: 'https://facebook.com' }
    ],
    is_verified: true,
    trust_score: 85,
    onboarding_stage: "verified",
    slot_booking_enabled: true,
    last_active_at: new Date(),
  };
  const changeProfilePhoto = async(e)=>{
      const newProfilePhoto = e.target.files[0];
      if (!newProfilePhoto || !newProfilePhoto.type.startsWith('image/')) {
        toast.warning("Please select a valid image file (JPG, PNG, etc.)");
        return;
      }
      if (newProfilePhoto.size > 2 * 1024 * 1024) {
        toast.error("Image too large. Please upload a file smaller than 2MB.");
        return;
      }
      await requestHandler(dispatch,() => barberServices.changeProfilePhoto(newProfilePhoto),{
        onSuccess: (res) =>{
          toast.success(res.data.newProfileLink)
        }
      })
  }

  return (
    <div className="min-h-screen bg-white font-['Inter']">
      <div className="max-w-6xl mx-auto p-8 space-y-8">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-navy tracking-tight">
            {profile.business_name}
            {profile.is_verified && (
              <span className="ml-3 text-gold">
                <MdVerifiedUser className="inline-block w-6 h-6" />
              </span>
            )}
          </h1>
          <button className="flex items-center gap-2 text-navy hover:text-gold transition-colors group">
            <FiEdit className="w-5 h-5 transition-transform group-hover:scale-110" />
            <span className="font-medium">Edit Profile</span>
          </button>
        </div>
  
        {/* Main Profile ˀ̉̉̉̉Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8 border border-gray-100">
          {/* Identity Section */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="relative flex-shrink-0">
            <div className="relative group">
                {profile.profile_image ? (
                  <>
                    <img src={profile.profile_image?`http://localhost:8000/api/photos/${profile.profile_image}`:"Not available"} alt="Profile" className="w-40 h-40 rounded-full object-cover border-4 border-gold/20 shadow-lg transition-opacity group-hover:opacity-75"/>
                    <label htmlFor="profile-upload" className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <span className="text-white text-sm font-medium flex items-center gap-1"><FiEdit className="w-4 h-4" />Change</span>
                    </label>
                  </>
                ) : (
                  <label htmlFor="profile-upload" className="w-40 h-40 rounded-full border-2 border-dashed border-gold/40 flex items-center justify-center cursor-pointer hover:bg-gold/5 transition-colors">
                    <span className="text-gold text-sm font-medium flex items-center gap-1">
                      <FiUpload className="w-4 h-4" /> Upload Photo
                    </span>
                  </label>
                )}
           <input id="profile-upload" type="file" accept="image/png, image/jpeg, image/jpg" className="hidden" onChange={changeProfilePhoto}/>
            </div>

              <div className="absolute -bottom-3 right-0 bg-white px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                <FaCheckCircle className="text-sage w-5 h-5" />
                <span className="text-sm font-medium text-navy">
                  {profile.experience}+ Years
                </span>
              </div>
            </div>
  
            <div className="space-y-4 flex-1">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-navy">{profile.name}</h2>
                <p className="text-warm-gray leading-relaxed max-w-2xl">
                  {profile.bio}
                </p>
                <div className="flex items-center gap-2 text-warm-gray">
                  <RiMapPinLine className="text-gold w-5 h-5 flex-shrink-0" />
                  <address className='not-italic text-sm text-gray-500'>{profile.location}</address>
                </div>
              </div>
  
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <StatBlock label="Contact" value={profile.phone} />
                <StatBlock label="Email" value={profile.email} />
                <StatBlock 
                  label="Trust Score" 
                  value={`${profile.trust_score}/100`}
                  valueColor="text-sage"
                />
              </div>
            </div>
          </div>
  
          {/* Divider */}
          <div className="border-t border-gray-100" />
  
          {/* Services Section */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <SectionTitle>Services Offered</SectionTitle>
              <div className="grid grid-cols-2 gap-3">
                {profile.services_offered.map((service, i) => (
                  <div key={i} className="bg-gold/5 p-3 rounded-lg flex items-center gap-2">
                    <div className="w-2 h-2 bg-gold rounded-full" />
                    <span className="text-navy">{service}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
  
          {/* Social Links */}
          <div className="space-y-4">
            <SectionTitle>Connect With Us</SectionTitle>
            <div className="flex gap-8">
              {profile.social_links.map((link, i) => (
                <a
                  key={i}
                  href={link.link}
                  target=' __self'
                  className="w-10 h-10 rounded-full bg-sage/5 flex items-center justify-center hover:bg-sage/10 text-blue-500 transition-colors"
                  title={`Visit our ${link.platform}`}>
                  <span className="text-sage">{/* Platform icon here */}</span>
                  {link.platform}
                </a>
              ))}
            </div>
          </div>
          {/* Account Details Section */}
<div className="space-y-4">
  <SectionTitle>Bank Account Details</SectionTitle>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <StatBlock label="Account Holder" value={profile.account_details.account_holder_name} />
    <StatBlock label="Account Number" value={profile.account_details.account_number} />
    <StatBlock label="Bank Name" value={profile.account_details.bank_name} />
    <StatBlock label="IFSC Code" value={profile.account_details.ifsc_code} />
    <StatBlock label="UPI ID" value={profile.account_details.upi_id} />
  </div>
</div>

        </div>
      </div>
    </div>
  );
  
};
// Reusable components
const StatBlock = ({ label, value, valueColor = "text-navy" }) => (
  <div className="bg-gray-50 p-4 rounded-xl">
    <span className="text-sm text-warm-gray block mb-1">{label}</span>
    <span className={`${valueColor} font-medium block truncate`}>{value}</span>
  </div>
);

const SectionTitle = ({ children }) => (
  <h3 className="text-lg font-semibold text-navy flex items-center gap-2">
    <div className="w-1.5 h-1.5 bg-gold rounded-full" />
    {children}
  </h3>
);

export default Profile;
