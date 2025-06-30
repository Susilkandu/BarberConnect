import {Routes, Route} from 'react-router-dom';
import Profile from '../pages/Profile';
import NearbySalon from "../../public/pages/NearBySalons";
import BookNow from '../pages/booking/BookNow';
import BookingSuccess from '../pages/booking/BookingSuccess';
import BookingHistory from '../pages/booking/BookingHistory';
import BookingDetails from '../pages/booking/BookingDetails';
 const publicRoutes = [
  {path:'profile', element:<Profile/>},
  {path:'', element:<NearbySalon/>},
  {path:"bookNow/:salon_id", element: <BookNow/>},
  {path:"bookingSuccess", element: <BookingSuccess/>},
  {path:"bookingHistory", element: <BookingHistory/>},
  {path:"bookingDetails", element: <BookingDetails/>}
];
export default publicRoutes;