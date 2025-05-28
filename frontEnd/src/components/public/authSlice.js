import {createSlice} from '@reduxjs/toolkit'
import Cookies from 'js-cookie';
const initialState = {
    role: 'public',
    isAuthenticated: false,
    loading: false
}
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers:{
        loginSuccess:(state, action) =>{
            state.role = action.payload.role;
            state.isAuthenticated = action.payload.isAuthenticated;
        },
        logout:(state) =>{
            state.role = 'public';
            state.isAuthenticated = false;
            Cookies.remove('businessToken');
            Cookies.remove('customerToken');
            Cookies.remove('adminToken');
        },
        setLoading: (state,action) =>{
            state.loading = action.payload.loading
        },
    }
});
export const {loginSuccess, logout, setLoading} = authSlice.actions;
export default authSlice.reducer;
