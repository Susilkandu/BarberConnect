import {Routes, Route} from 'react-router-dom';
import NearbyBarber from '../pages/NearbyBarber';
import Login from '../pages/Login';
import About from '../pages/About';
import Contact from '../pages/Contact';
import SignUp from '../pages/Signup';
import ResetPassword  from '../pages/ResetPassword';
 const publicRoutes = [
  {path:'', element:<NearbyBarber/>},
  {path:'about',element:<About/>},
  {path:'SignUp',element:<SignUp/>},
  {path:'contact',element:<Contact/>},
  {path:'login',element:<Login/>},
  {path:'resetPassword', element: <ResetPassword/>}
];
export default publicRoutes;