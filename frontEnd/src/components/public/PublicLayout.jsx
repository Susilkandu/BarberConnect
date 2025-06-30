import { Outlet} from 'react-router-dom';
import Navbar from '../Navbar'
import {toast} from 'react-hot-toast'
import { useDispatch } from 'react-redux';
import {setLiveLocation} from './authSlice';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import {setLoading} from './authSlice';
import ErrorBoundary from '../common/ErrorBoundary';

const PublicLayout = () => {
  const liveLocation = useSelector(state => state.auth.liveLocation);
  const dispatch = useDispatch();
  useEffect(() => {
  (async function () {
    dispatch(setLoading({ loading: true }));
    const handleLocationCoords = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          dispatch(setLiveLocation([longitude, latitude]));
          dispatch(setLoading({ loading: false }));
        },
        (error) => {
          console.log("Geolocation error object:", error);
          switch(error.code){
            case error.PERMISSION_DENIED:
              toast.error("Please Allow location Permission");
              break;
            case error.POSITION_UNAVAILABLE:
              // toast.error("Location information is unvailable.");
              console.log("Location information is unavailable.")
              break;
            case error.TIMEOUT:
              toast.error("The request to get user location time out");
              break;
            default:
              toast.error("An unknown error occured",error);
              break;
          }
          dispatch(setLoading({ loading: false }));

        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    };
    handleLocationCoords();
  })();
}, []);

  return (
    <ErrorBoundary>
    <div>
      <main className="p-2  min-h-[80vh] bg-gray-50">
  { 
  // liveLocation[0] &&
  <ErrorBoundary><Outlet /></ErrorBoundary>}
      </main>
      <Navbar/>
    </div>
    </ErrorBoundary>
  );
};

export default PublicLayout;
