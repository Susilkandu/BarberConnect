import { Outlet, NavLink } from 'react-router-dom';
import Loader from '../common/Loader'
import Navbar from '../Navbar'
const PublicLayout = () => {
  return (
    <div>
      <main className="p-2 min-h-[80vh] bg-gray-50">
        <Outlet />
      </main>
      <Navbar/>
    </div>
  );
};

export default PublicLayout;
