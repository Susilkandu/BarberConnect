import NearBySalons from '../pages/NearBySalons';
import ViewSalonProfile from '../pages/ViewSalonProfile';
import Login from '../pages/Login';
import About from '../pages/About';
import Contact from '../pages/Contact';
import SignUp from '../pages/Signup';
import ResetPassword  from '../pages/ResetPassword';
 const publicRoutes = [
  {path:'', element:<NearBySalons/>},
  {path:'/ViewSalonProfile/:salon_id', element:<ViewSalonProfile/>},
  {path:'about',element:<About/>},
  {path:'SignUp',element:<SignUp/>},
  {path:'contact',element:<Contact/>},
  {path:'login',element:<Login/>},
  {path:'resetPassword', element: <ResetPassword/>}
];
export default publicRoutes;