import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { FiUserPlus, FiSave } from 'react-icons/fi';
import staffManagementServices from '../../../../services/salon/staff/staffManagement';
import requestHandler from '../../../../utils/requestHandler';

export default function AddStaff() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    dob: '',
    phone: '',
    email: '',
    role: '',
    status: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addNewStaffHandler = async () => {
    const isValidForm = Object.values(formData).every(value => value.trim() !== '');
    if (!isValidForm) {
      toast.error("Please fill up all fields");
      return;
    }
    const { name, gender, dob, phone, email, role, status } = formData;
    await requestHandler(
      dispatch,
      () => staffManagementServices.addStaff(name, gender, dob, phone, email, role, status),
      1
    );
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-xl space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <FiUserPlus className="text-2xl text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800">Add New Staff</h2>
      </div>

      <div className="space-y-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
        />
        <div>
          <label className="block mb-1 text-gray-700 font-medium">Gender</label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formData.gender === 'male'}
                onChange={handleChange}
                className="accent-blue-600"
              />
              <span>Male</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formData.gender === 'female'}
                onChange={handleChange}
                className="accent-pink-600"
              />
              <span>Female</span>
            </label>
          </div>
        </div>


        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          placeholder="Date of Birth"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
        />

        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Contact Number"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
        />

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
        />

        <input
          type="text"
          name="role"
          value={formData.role}
          onChange={handleChange}
          placeholder="Role"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
        />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
        >
          <option value="">Select Status</option>
          <option value="active">Active</option>
          <option value="deactive">Deactive</option>
        </select>
      </div>

      <button
        type="button"
        onClick={addNewStaffHandler}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
      >
        <FiSave className="text-lg" />
        Save Staff
      </button>
    </div>
  );
}
