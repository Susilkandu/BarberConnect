import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUser, FaCalendarAlt, FaSignOutAlt } from 'react-icons/fa';

export default function Sidebar() {
  const { pathname } = useLocation();

  const menu = [
    { name: 'Dashboard', icon: <FaHome />, path: '/customer' },
    { name: 'My Bookings', icon: <FaCalendarAlt />, path: '/customer/bookings' },
    { name: 'Profile', icon: <FaUser />, path: '/customer/profile' }
  ];

  return (
    <div className="w-64 min-h-screen bg-white/10 backdrop-blur-md border-r border-white/10 p-6 shadow-2xl">
      <h1 className="text-2xl font-bold mb-8 text-white tracking-wide">Barber<span className="text-blue-400">Connect</span></h1>
      <nav className="flex flex-col gap-4">
        {menu.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
              pathname === item.path
                ? 'bg-white/20 text-blue-400'
                : 'hover:bg-white/10 text-white'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        ))}
        <button className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-red-500/20 text-red-400 mt-8">
          <FaSignOutAlt className="text-lg" />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
}
