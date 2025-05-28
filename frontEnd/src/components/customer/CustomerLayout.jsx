import { Outlet } from 'react-router-dom';
import Sidebar from './subComponents/Sidebar';

export default function CustomerLayout() {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#1a1a40] via-[#25255b] to-[#1a1a40] text-white">
      Hle
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto backdrop-blur-md">
        <Outlet />
      </div>
    </div>
  );
}
