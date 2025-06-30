import ShowServices from '../subComponents/ManageServices/ShowServices';
import AddNewServices from '../subComponents/ManageServices/AddNewServices';
import DeleteServices from '../subComponents/ManageServices/DeleteServices';
import Bookings from '../subComponents/Bookings';
// View Staff List
import ViewStaffList from '../subComponents/ManageStaff/ViewStaffList';
import AddStaff from '../subComponents/ManageStaff/AddStaff';
import UpdateStaff from '../subComponents/ManageStaff/UpdateStaff'

import Profile from '../pages/Profile';
 const salonRoutes = [
  {path:'profile', element:<Profile/>},
  {path:'services', element:<ShowServices/>},
  {path:'services/add', element:<AddNewServices/>},
  {path:'services/delete', element:<DeleteServices/>},
  {path:'bookings', element:<Bookings/>},
  // Staff Management
  {path:"staff/viewStaff", element:<ViewStaffList/>},
  {path:"staff/add", element:<AddStaff/>},
  {path:"staff/updateStaff", element:<UpdateStaff/>}
 
];
export default salonRoutes;