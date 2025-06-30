import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { FiPlusCircle } from 'react-icons/fi';
import { BiRupee } from 'react-icons/bi';
import { MdAccessTime, MdWc } from 'react-icons/md';
import requestHandler from "../../../../utils/requestHandler";
import salonServices from "../../../../services/salon/salonServices";
import toast from 'react-hot-toast';

const AddNewServices = ({ salonId }) => {
  const dispatch = useDispatch();
  const [masterServices, setMasterServices] = useState([]);
  const [formData, setFormData] = useState({
    service_id: '',
    price: '',
    estimated_duration: '',
    gender: 'unisex'
  });

  const fetchMasterServices = async () => {
    await requestHandler(dispatch, () => salonServices.getAllMasterServices(), 0, {
      onSuccess: (res) => setMasterServices(res.data.data)
    });
  };

  useEffect(() => {
    fetchMasterServices();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.service_id || !formData.price || !formData.estimated_duration) {
      toast.error("Please enter valid details");
      return;
    }
    await requestHandler(dispatch, () => salonServices.addSalonServices(
      formData.service_id,
      formData.price,
      formData.estimated_duration,
      formData.gender
    ), 1, {
      onSuccess: () => {
        setFormData({ service_id: "", price: "", estimated_duration: "", gender: "unisex" });
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]  py-10 px-4 font-[Inter]">
      <div className="w-full max-w-md bg-[#E5E7EB] p-6 border-2 sm:p-8 rounded-3xl shadow-2xl space-y-6 transition-transform transform hover:scale-[1.02] duration-300">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] text-center flex items-center justify-center gap-2 tracking-wide leading-snug">
          <FiPlusCircle className="text-[#FFD369]" size={28} /> Add New Service
        </h2>

        <div className="space-y-4 text-sm sm:text-base">
          {/* Select Service */}
          <div>
            <label className="block text-[#111827] mb-2 font-medium">Select Service</label>
            <select
              name="service_id"
              value={formData.service_id}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-[#F9FAFB] border border-[#94A3B8] focus:ring-2 focus:ring-[#FFD369] outline-none text-[#111827] font-medium"
            >
              <option value="">-- Select a Service --</option>
              {masterServices.map(service => (
                <option key={service._id} value={service._id}>
                  {service.name} ({service.category})
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-[#111827] mb-2 font-medium flex items-center gap-1">
              <BiRupee /> Price (₹)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-[#F9FAFB] border border-[#94A3B8] focus:ring-2 focus:ring-[#FFD369] outline-none text-[#111827] font-medium"
              placeholder="Enter price"
            />
          </div>

          {/* Estimated Duration */}
          <div>
            <label className="block text-[#111827] mb-2 font-medium flex items-center gap-1">
              <MdAccessTime /> Estimated Duration (mins)
            </label>
            <input
              type="number"
              name="estimated_duration"
              value={formData.estimated_duration}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-[#F9FAFB] border border-[#94A3B8] focus:ring-2 focus:ring-[#FFD369] outline-none text-[#111827] font-medium"
              placeholder="Enter duration"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-[#111827] mb-2 font-medium flex items-center gap-1">
              <MdWc /> Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-[#F9FAFB] border border-[#94A3B8] focus:ring-2 focus:ring-[#FFD369] outline-none text-[#111827] font-medium"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="unisex">Unisex</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full py-3 rounded-xl bg-[#FFD369] text-[#1F2937] font-semibold hover:bg-[#e6c157] transition duration-300 shadow-md text-sm sm:text-base flex items-center justify-center gap-2 tracking-wide"
          >
            <FiPlusCircle size={20} /> Add Service
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNewServices;
