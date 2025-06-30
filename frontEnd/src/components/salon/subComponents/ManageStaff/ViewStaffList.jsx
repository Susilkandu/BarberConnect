import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {Link} from 'react-router-dom';
import { FiEdit, FiTrash2, FiUsers } from 'react-icons/fi';
import requestHandler from '../../../../utils/requestHandler';
import staffManagementServices from '../../../../services/salon/staff/staffManagement';

export default function ViewStaffList() {
  const dispatch = useDispatch();
  const [staffList, setStaffList] = useState([]);

  const viewStaffListHandler = async () => {
    await requestHandler(dispatch, () => staffManagementServices.getStaffList(), 0, {
      onSuccess: (res) => {
        setStaffList(res.data.data);
      },
    });
  };

  useEffect(() => {
    (async () => {
      await viewStaffListHandler();
    })();
  }, []);

  const handleDelete = async (staffId) => {
    const confirmed = window.confirm("Are you sure you want to delete this staff?");
    if (!confirmed) return;

    await requestHandler(dispatch, () => staffManagementServices.deleteStaff(staffId), 1, {
      onSuccess: async() => {
        await viewStaffListHandler();
      },
    });
  };

  if (!staffList.length) {
    return (
      <div className="text-center py-12 text-gray-500 text-lg">
        <FiUsers className="mx-auto text-4xl mb-2" />
        No Staff Found
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
      <div className="p-6 flex items-center justify-between border-b">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <FiUsers className="text-blue-600" /> Staff List
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Gender</th>
              <th className="px-6 py-4">DOB</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {staffList.map((staff) => (
              <tr key={staff._id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">{staff?.name}</td>
                <td className="px-6 py-4 capitalize">{staff?.gender}</td>
                <td className="px-6 py-4">
                  {staff?.dob ? new Date(staff?.dob).toLocaleDateString() : "-"}
                </td>
                <td className="px-6 py-4">{staff?.phone}</td>
                <td className="px-6 py-4">{staff?.email}</td>
                <td className="px-6 py-4 capitalize">{staff?.role}</td>
                <td className="px-6 py-4 capitalize">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      staff?.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {staff?.status}
                  </span>
                </td>
                <td className="px-6 py-4 flex items-center gap-3">
                  <Link
                    to = {`/salon/staff/updateStaff`}
                    state={{ staff }}
                    className="text-blue-600 hover:text-blue-800 transition"
                  >
                    <FiEdit className="text-lg" />
                  </Link>
                  <button
                    onClick={() => handleDelete(staff._id)}
                    className="text-red-600 hover:text-red-800 transition"
                  >
                    <FiTrash2 className="text-lg" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
