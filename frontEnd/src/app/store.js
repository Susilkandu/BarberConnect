import {configureStore} from '@reduxjs/toolkit';
import authReducer from '../components/public/authSlice';
import customerReducer from '../components/customer/customerSlice';
import barberReducer from '../components/barber/barberSlice';
// import adminReducer from './features/admin/adminSlice'
export const store = configureStore({
    reducer:{
        auth: authReducer,
        customer: customerReducer,
        barber: barberReducer,
        // admin: adminReducer
    }
});
