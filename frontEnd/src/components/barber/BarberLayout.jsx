import React, { useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { FaBars, FaRegClock } from 'react-icons/fa';
import { RiDashboard3Fill, RiLogoutBoxRLine } from "react-icons/ri";
import { IoPerson } from "react-icons/io5";
import { useSelector, useDispatch } from 'react-redux';
import { toggleSidebar, setProfile } from './barberSlice';

import barberServices from '../../services/barber/barberServices';
import ErrorBoundary from '../common/ErrorBoundary';
import requiestHandler from '../../utils/requestHandler';
import { setLoading, logout } from '../public/authSlice';


export default function BarberLayout() {
  const dispatch = useDispatch();
  const isSidebarOpen = useSelector((state) => state.barber.openSidebar);

  useEffect(()=>{
    (async()=>{
      await requiestHandler(dispatch, ()=> barberServices.getProfile(),{
        onSuccess: (res)=>{
          console.log(res.data.data[0])
          dispatch(setProfile({profile:res.data.data[0]}));
        }
      })
    })();
  },[]);
  const logOutBarber = async()=>{
    dispatch(logout());
  }

  return (
    <ErrorBoundary>
    <div className="h-screen top bg-[#F9FAFB] flex flex-col" >
      {/* Header */}
      <header className="bg-[#1F2937] text-white flex items-center justify-between p-2">
        <div className="flex items-center gap-4">
          <button className="text-white cursor-pointer text-4xl" onClick={() => dispatch(toggleSidebar())}>
            <FaBars size={20} />
          </button>
          <h1 className="text-xl font-semibold">Celestia</h1>
        </div>
        <div className='flex items-center'>
          <span className="text-[#FFD369] font-medium">Hello, Barber</span>
          <Link to="/barber/profile" className="flex items-center gap-3 text-lg hover:bg-gray-700 px-4 py-2 rounded transition">
                <IoPerson className="text-xl" />
          </Link>
          <Link to="/barber/logout" className="flex items-center gap-3 text-lg text-red-500 hover:bg-gray-700 px-4 py-2 rounded transition " onClick={logOutBarber}>
                <RiLogoutBoxRLine className="text-xl" />
          </Link>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden relative">
     
        {/* Sidebar */}
        <aside
          className={`bg-[#1F2937] text-white w-64 h-full fixed top-[50px] left-0 shadow-lg z-50 transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="p-6 space-y-6">
            <nav className="space-y-4">
              <Link to="/barber/dashboard" className="flex items-center gap-3 text-lg hover:bg-gray-700 px-4 py-2 rounded transition">
                <RiDashboard3Fill className="text-xl" />Dashboard
              </Link>
              <Link to="/barber/schedule" className="flex items-center gap-3 text-lg text-green-500 hover:bg-gray-700 px-4 py-2 rounded transition">
                <FaRegClock className="text-xl" />Schedule
              </Link>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main
          className={`transition-all duration-300 ease-in-out w-full px-4 py-4 overflow-y-auto text-[#111827]
          ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}
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
