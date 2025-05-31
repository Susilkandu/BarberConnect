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
        },
        (error) => {
          console.log(error);
          if (error.code === 1) {
            toast.error(
              "Location permission denied. Please enable location access in your browser settings."
            );
            return;
          }else{
          toast.error("Unable to get current location");
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
      dispatch(setLoading({ loading: false }));
    };
    handleLocationCoords();
  })();
}, []);

  return (
    <ErrorBoundary>
    <div>
      <main className="p-2  min-h-[80vh] bg-gray-50">
  { liveLocation[0] && <ErrorBoundary><Outlet /></ErrorBoundary>}
      </main>
      <Navbar/>
    </div>
    </ErrorBoundary>
  );
};

export default PublicLayout;
