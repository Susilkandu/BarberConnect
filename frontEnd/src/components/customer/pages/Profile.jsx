import React, { useState } from 'react';
import { MdModeEditOutline } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { profileServices } from '../../../services/customer';
import requestHandler from '../../../utils/requestHandler';
import { setProfile } from '../customerSlice';
import { toast } from 'react-hot-toast';

export default function Profile() {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.customer.profile);
  const handleChangeProfileImage = async (e)=>{
    const newProfilePhoto = e.target.files[0];
    await requestHandler(dispatch, () => profileServices.changeProfilePhoto(newProfilePhoto),{
      onSuccess: (res)=>{
        const newProfileImage = res.data.data.newProfileLink;
        dispatch(setProfile({...profile, profileImage:newProfileImage}));
      }
    })
  }
  const handleUpdate = async (data) => {
    await requestHandler(dispatch, () => profileServices.updateProfile(data), {
      onSuccess: (res) => {
        console.log(data)
        if(data.address){
          dispatch(setProfile({...profile, address:{
            ...profile.address,
            ...data.address
          }}));
        }
        else{
          dispatch(setProfile({...profile, ...data}));
        }
      },
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-3xl mx-auto border border-gray-200 space-y-5 mt-8">
      <div className="relative w-40 h-40 mx-auto mt-6">
  <img
    src={profile?.profileImage
      ? `http://localhost:8000/api/photos/${profile.profileImage}`
      : `https://t4.ftcdn.net/jpg/06/02/80/93/360_F_602809327_Wdh2Y0b8xB37Utz3Oq40tyngD7cPiAqw.jpg`
    }
    alt="Profile"
    className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg transition-transform duration-300 hover:scale-105"
  />

  <label
    htmlFor="changeProfileImage"
    className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-md cursor-pointer transition-all duration-300"
    title="Change Profile Picture"
  >
    <MdModeEditOutline className="text-lg" />
  </label>

  <input
    type="file"
    accept="image/*"
    hidden
    id="changeProfileImage"
    onChange={handleChangeProfileImage}
  />
</div>

      <h2 className="text-xl font-semibold text-gray-700 text-center">{profile?.name}</h2>
      {/* Fields */}
      <EditableField label="Full Name" value={profile?.name} fieldKey="name" onUpdate={handleUpdate} />
      <EditableField label="Phone" value={profile?.phone} fieldKey="phone" onUpdate={handleUpdate} />
      <EditableField label="Gender" value={profile?.gender} fieldKey="gender" onUpdate={handleUpdate} isSelect />
      <EditableField label="Date of Birth" value={profile?.dob?.slice(0, 10)} fieldKey="dob" onUpdate={handleUpdate} type="date" />

      <h3 className="text-md font-medium text-gray-600 mt-4">Address</h3>
      <EditableField label="Street" value={profile?.address?.street} fieldKey="address.street" onUpdate={handleUpdate} />
      <EditableField label="City" value={profile?.address?.city} fieldKey="address.city" onUpdate={handleUpdate} />
      <EditableField label="State" value={profile?.address?.state} fieldKey="address.state" onUpdate={handleUpdate} />
      <EditableField label="Postal Code" value={profile?.address?.postalCode} fieldKey="address.postalCode" onUpdate={handleUpdate} />
    </div>
  );
}

function EditableField({ label, value, fieldKey, onUpdate, isSelect = false, type = "text" }) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value || '');

  const save = async () => {
    const data = generateNestedObject(fieldKey, tempValue);
    await onUpdate(data);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-2">
      <div className="flex-1 w-full">
        <label className="text-sm text-gray-600 mb-1 block">{label}</label>

        {isEditing ? (
          isSelect ? (
            <select
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          ) : (
            <input
              type={type}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none"
            />
          )
        ) : (
          <p
            onClick={() => setIsEditing(true)}
            className="cursor-pointer p-2 bg-gray-100 rounded hover:bg-gray-200 transition"
          >
            {value || <span className="text-gray-400">Click to edit</span>}
          </p>
        )}
      </div>

      {isEditing && (
        <button
          onClick={save}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md mt-1 sm:mt-0"
        >
          Update
        </button>
      )}
    </div>
  );
}

// Utility to handle nested fields like 'address.city'
function generateNestedObject(path, value) {
  const keys = path.split('.');
  const result = {};
  let current = result;

  keys.forEach((key, index) => {
    if (index === keys.length - 1) {
      current[key] = value;
    } else {
      current[key] = {};
      current = current[key];
    }
  });

  return result;
}
