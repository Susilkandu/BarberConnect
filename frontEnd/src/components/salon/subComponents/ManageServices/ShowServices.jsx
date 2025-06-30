import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { MdOutlineTimer } from "react-icons/md";
import { FaRupeeSign, FaEdit, FaSave, FaTrash } from "react-icons/fa";
import requestHandler from "../../../../utils/requestHandler";
import salonServices from "../../../../services/salon/salonServices";

export default function ShowServices() {
  const dispatch = useDispatch();
  const [services, setServices] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState({
    price: "",
    estimated_duration: "",
    gender: "",
  });

  useEffect(() => {
    fetchAllSalonServices();
  }, []);

  const fetchAllSalonServices = async () => {
    await requestHandler(
      dispatch,
      () => salonServices.getAllSalonServices(),
      0,
      {
        onSuccess: (res) => {
          setServices(res.data.data);
        },
      }
    );
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    const service = services[index];
    setEditData({
      price: service.price,
      estimated_duration: service.estimated_duration,
      gender: service.gender,
    });
  };

  const handleSave = async (service_id) => {
    // API Call to update service here
    await requestHandler(
      dispatch,
      () =>
        salonServices.addSalonServices(
          service_id,
          editData.price,
          editData.estimated_duration,
          editData.gender
        ),
      1,
      {
        onSuccess: (res) => {
           const updatedServices = services.map((service, idx) =>
          idx === editIndex ? { ...service, ...editData } : service
        );
        setServices(updatedServices);
        setEditIndex(null);
        setEditData({ price: "", estimated_duration: "", gender: "" });
        },
      }
    );
  };

  const handleDelete = async (index, service_id) => {
    if(window.confirm("Are you confert to delete")){
    await requestHandler(
      dispatch,
      () => salonServices.removeSalonServices(service_id),
      1,
      {
        onSuccess: (res) => {
          const updatedServices = services.filter((servce, i) => i !== index);
          setServices(updatedServices);
        },
      }
    );
  }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-4 md:p-8 bg-[#F9FAFB] min-h-screen">
      <h3 className="text-2xl font-semibold text-[#1F2937] mb-6 text-center">
        Salon Services
      </h3>
      {services.length > 0 ? (
        <div className="overflow-x-auto shadow-lg rounded-lg border border-[#E5E7EB] max-h-[500px]">
          <table className="min-w-full bg-white">
            <thead className="bg-[#1F2937] text-white sticky top-0 z-10">
              <tr>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Category</th>
                <th className="py-3 px-4 text-left">Description</th>
                <th className="py-3 px-4 text-center">Duration (Min)</th>
                <th className="py-3 px-4 text-center">For</th>
                <th className="py-3 px-4 text-center">Price</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service, index) => (
                <tr
                  key={index}
                  className="border-b border-[#E5E7EB] hover:bg-[#F9FAFB] transition"
                >
                  <td className="py-3 px-4 text-[#111827]">
                    {service?.service_id?.name}
                  </td>
                  <td className="py-3 px-4 text-[#94A3B8]">
                    {service?.service_id?.category}
                  </td>
                  <td className="py-3 px-4 text-[#111827]">
                    {service?.service_id?.description}
                  </td>

                  <td className="py-3 px-4 text-center text-[#111827]">
                    {editIndex === index ? (
                      <input
                        type="number"
                        name="estimated_duration"
                        value={editData.estimated_duration}
                        onChange={handleChange}
                        className="border px-2 py-1 w-16 text-center"
                      />
                    ) : (
                      service.estimated_duration
                    )}
                  </td>

                  <td className="py-3 px-4 text-center text-[#111827] capitalize">
                    {editIndex === index ? (
                      <select
                        name="gender"
                        value={editData.gender}
                        onChange={handleChange}
                        className="border px-2 py-1"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="unisex">Unisex</option>
                      </select>
                    ) : (
                      service.gender
                    )}
                  </td>

                  <td className="py-3 px-4 text-center text-[#1F2937] font-semibold">
                    {editIndex === index ? (
                      <input
                        type="number"
                        name="price"
                        value={editData.price}
                        onChange={handleChange}
                        className="border px-2 py-1 w-20 text-center"
                      />
                    ) : (
                      <>₹ {service.price}</>
                    )}
                  </td>

                  <td className="py-3 px-4 text-center flex justify-center gap-2">
                    {editIndex === index ? (
                      <button
                        onClick={() => handleSave(service.service_id._id)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <FaSave size={18} />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEdit(index)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(index, service.service_id._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-[#94A3B8] mt-10 text-lg">
          No Services Found. Please Add New Services.
        </div>
      )}
    </div>
  );
}
