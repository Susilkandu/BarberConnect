import React, { useEffect, useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { FaBars, FaRegClock } from "react-icons/fa";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { MdManageAccounts } from "react-icons/md";
import { FaPlus, FaList } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";

import { useSelector, useDispatch } from "react-redux";
import { toggleSidebar, setProfile } from "./salonSlice";

import salonServices from "../../services/salon/salonServices";
import ErrorBoundary from "../common/ErrorBoundary";
import requestHandler from "../../utils/requestHandler";
import { logout } from "../public/authSlice";

export default function SalonLayout() {
  const dispatch = useDispatch();
  const [isServiceMenuOpen, setIsServiceMenuOpen] = useState(false);
  const [isStaffMenuOpen, setIsStaffMenuOpen] = useState(false);
  const isSidebarOpen = useSelector((state) => state.salon.openSidebar);
  const brandName = useSelector((state) => state.auth.brandName);
  useEffect(() => {
    (async () => {
      await requestHandler(dispatch, () => salonServices.getProfile(), 0, {
        onSuccess: (res) => {
          dispatch(setProfile({ profile: res.data.data[0] }));
        },
      });
    })();
  }, []);
  const logOutSalon = async () => {
    dispatch(logout());
  };
  return (
    <ErrorBoundary>
      <div className="h-screen top bg-[#F9FAFB] flex flex-col">
        {/* Header */}
        <header className="bg-[#1F2937] text-white flex items-center justify-between p-2">
          <div className="flex items-center gap-4">
            <button
              className="text-white cursor-pointer text-4xl"
              onClick={() => dispatch(toggleSidebar())}
              >
              <FaBars size={20} />
            </button>
            <h1 className="text-xl font-semibold">{brandName}</h1>
          </div>
          <div className="flex items-center">
            <span className="text-[#FFD369] font-medium">Hello, Sir</span>
            <Link
              to="/salon/profile"
              className="flex items-center gap-3 text-lg hover:bg-gray-700 px-4 py-2 rounded transition"
            >
              <IoPerson className="text-xl" />
            </Link>
            <Link
              to="/salon/logout"
              className="flex items-center gap-3 text-lg text-red-500 hover:bg-gray-700 px-4 py-2 rounded transition "
              onClick={logOutSalon}
            >
              <RiLogoutBoxRLine className="text-xl" />
            </Link>
          </div>
        </header>

        {/* Main Layout */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Sidebar */}
          <aside
            className={`bg-[#1F2937] text-white w-64 h-full fixed top-[50px] left-0 shadow-lg z-50 transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
          >
            <div className="p-6 space-y-6">
              <nav className="space-y-4">
                <Link
                  to="/salon/bookings"
                  className="flex items-center gap-3 text-lg text-green-500 hover:bg-gray-700 px-4 py-2 rounded transition"
                >
                  <FaRegClock className="text-xl" />
                  Bookings
                </Link>
                     {/* Manage Services */}
                <div>
                  <button
                    onClick={() => setIsServiceMenuOpen(!isServiceMenuOpen)}
                    className="flex items-center gap-3 text-lg hover:bg-gray-700 px-4 py-2 rounded transition w-full text-left cursor-pointer"
                  >
                    <MdManageAccounts className="text-xl" />
                    Manage Services
                  </button>

                  {/* Submenu */}
                  {isServiceMenuOpen && (
                    <div className="ml-6 mt-1 space-y-1">
                      <Link
                        to="/salon/services"
                        className="flex items-center gap-2 hover:text-gray-300"
                      >
                        <FaList /> Show Services
                      </Link>
                      <Link
                        to="/salon/services/add"
                        className="flex items-center gap-2 hover:text-gray-300"
                      >
                        <FaPlus /> Add New Service
                      </Link>
                    </div>
                  )}
                </div>
                     {/* Manage Services */}
                <div>
                  <button
                    onClick={() => setIsStaffMenuOpen(!isStaffMenuOpen)}
                    className="flex items-center gap-3 text-lg hover:bg-gray-700 px-4 py-2 rounded transition w-full text-left cursor-pointer"
                  >
                    <MdManageAccounts className="text-xl" />
                    Manage Staff
                  </button>

                  {/* Submenu */}
                  {isStaffMenuOpen && (
                    <div className="ml-6 mt-1 space-y-1">
                      <Link
                        to="/salon/staff/viewStaff"
                        className="flex items-center gap-2 hover:text-gray-300"
                      >
                        <FaList /> Show staff
                      </Link>
                      <Link
                        to="/salon/staff/add"
                        className="flex items-center gap-2 hover:text-gray-300"
                      >
                        <FaPlus /> Add new Staff
                      </Link>

                    </div>
                  )}
                </div>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main
            className={`transition-all duration-300 ease-in-out w-full px-4 py-4 overflow-y-auto text-[#111827]
          ${isSidebarOpen ? "ml-64" : "ml-0"}`}
          >
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}
