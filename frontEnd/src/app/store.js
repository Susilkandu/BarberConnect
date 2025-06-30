import {configureStore} from '@reduxjs/toolkit';
import authReducer from '../components/public/authSlice';
import customerReducer from '../components/customer/customerSlice';
import salonReducer from '../components/salon/salonSlice';
// import adminReducer from './features/admin/adminSlice'
export const store = configureStore({
    reducer:{
        auth: authReducer,
        customer: customerReducer,
        salon: salonReducer,
        // admin: adminReducer
    }
});
