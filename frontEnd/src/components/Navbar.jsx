import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUserCog, FaUser, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import { FiInfo} from "react-icons/fi";
import {BsScissors}  from 'react-icons/bs';
import { RiCustomerServiceLine, RiLoginBoxLine} from "react-icons/ri";
import { MdDashboard, MdSchedule } from 'react-icons/md';
import {useSelector} from "react-redux";

  const Navbar = () => {
    const {role} = useSelector((state)=> state.auth);
  const navItems =  {
    public: [
      { label: 'Barber', icon: <BsScissors/>, to:'/'},
      { label: 'About', icon: <FiInfo />, to: '/about' },
      { label: 'Contact', icon: <RiCustomerServiceLine />, to: '/contact' },
      { label: 'Login', icon: <RiLoginBoxLine />, to: '/login' },
      { label: 'SignUp', icon: <FaUserPlus />, to: '/signUp' },
    ],
    customer: [
      { label: 'Home', icon: <FaHome />, to: '/' },
      { label: 'Barbers', icon: <BsScissors />, to: '/barbers' },
      { label: 'Profile', icon: <FaUser />, to: '/customer/profile' },
    ],
    barber: [
      { label: 'Home', icon: <FaHome />, to: '/' },
      { label: 'Schedule', icon: <MdSchedule />, to: '/barber/schedule' },
      { label: 'Profile', icon: <FaUser />, to: '/barber/profile' },
    ],
    admin: [
      { label: 'Home', icon: <FaHome />, to: '/' },
      { label: 'Dashboard', icon: <MdDashboard />, to: '/admin/dashboard' },
      { label: 'Users', icon: <FaUserCog />, to: '/admin/users' },
    ],
  };

  return (
        <div className="fixed bottom-0 left-0 w-full bg-[#1F2937] border-t border-gray-700 flex justify-around items-center py-3 z-50 md:top-0 md:bottom-auto">
        {navItems[role]?.map((item,index)=>(
          <Link to={item.to} className="flex flex-col justify-center items-center text-center text-[#F9FAFB] text-xl hover:text-yellow-300 transition" key={index}>
              <div className='text-2xl mb-1 md:hidden'>{item.icon}</div>
              <span className='text-[0.7rem]'>{item.label}</span>
          </Link>
        ))}
      </div>
  );
};

export default Navbar;
