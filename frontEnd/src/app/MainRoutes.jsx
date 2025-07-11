import {Routes, Route} from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import salonServices from "../services/salon/salonServices";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { loginSuccess, setLoading } from "../components/public/authSlice";
import { setProfile } from "../components/salon/salonSlice";
import Cookies from 'js-cookie';
//Layouts
import PulicLayout from '../components/public/PublicLayout';
import CustomerLayout from '../components/customer/CustomerLayout';
import AdminLayout from '../components/admin/AdminLayout';
import SalonLayout from '../components/salon/SalonLayout';

//Route groups
import publicRoutes from '../components/public/routes/publicRoutes';
import salonRoutes from '../components/salon/routes/SalonRoutes';
import customerRoutes from '../components/customer/routes/CustomerRoute';
// import adminRoutes from '../components/admin/routes/AdminRoute';

//PrivateRoute wrapper
import PrivateRoute from './PrivateRoute';
import PublicLayout from "../components/public/PublicLayout";
import Loader from "../components/common/Loader";
import { useEffect } from "react";


export default function MainRoutes() {
  const navigate = useNavigate();
  const loading = useSelector(state=>state.auth.loading);
  const dispatch = useDispatch();
  useEffect(()=>{
   ; (async()=>{
      try {
        if(Cookies.get('salonToken')){
          dispatch(setLoading({loading:true}));
          const res = await salonServices.getProfile();
          dispatch(loginSuccess({role:"salon",isAuthenticated:true}));
          dispatch(setProfile(res.data.data[0]));
          navigate('/salon');
        }
        if(Cookies.get('customerToken')){
          dispatch(setLoading({loading:true}));
          // const res = await salonServices.getProfile();
          dispatch(loginSuccess({role:"customer",isAuthenticated:true}));
          // dispatch(setProfile(res.data[0]));
          navigate('/customer');
        }
      } catch (error) {
        toast.error('some Error occured');
        console.log(error);
      }finally{
        dispatch(setLoading({loading:false}));
      }
    })();
  },[]);
  useEffect(() => {
    window.onerror = function (message, source, lineno, colno, error) {
      console.error("Global JS Error:", message, { source, lineno, colno, error });
      // Optional: send to logging system
    };

    window.onunhandledrejection = function (event) {
      console.error("Unhandled Promise Rejection:", event.reason);
      // Optional: log it
    };
  }, []);
  return (
    <>
    <Toaster position="top-center" />
    <Routes>
      <Route path="/" element={<PublicLayout/>}>
        {
          publicRoutes.map(({path,element},index)=>(
            <Route key={index} path={path} element={element}/>
          ))
        }
      </Route>
      <Route path="/salon/*" element={
        <PrivateRoute requiredRole="salon">
          <SalonLayout/>
        </PrivateRoute>
      }>
        {
          salonRoutes.map(({path, element}, index) => (
            <Route key={index} path={path} element={element} />
          ))
        }
      </Route>
      <Route path="/customer/*" element={
        <PrivateRoute requiredRole="customer">
          <CustomerLayout/>
        </PrivateRoute>
      }>
        {
          customerRoutes.map(({path, element}, index) => (
            <Route key={index} path={path} element={element} />
          ))
        }
      </Route>
      </Routes>

    {
      loading && <Loader/>
    }
    </>
    
  )
}
