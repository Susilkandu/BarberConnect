import {createSlice} from '@reduxjs/toolkit'
import Cookies from 'js-cookie';
const initialState = {
    brandName:"Celestia",
    role: 'public',
    isAuthenticated: false,
    loading: false,
    liveLocation: []
}
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers:{
        setLiveLocation: (state, action) =>{
            state.liveLocation = action.payload
        },
        loginSuccess:(state, action) =>{
            state.role = action.payload.role;
            state.isAuthenticated = action.payload.isAuthenticated;
        },
        logout:(state) =>{
            state.role = 'public';
            state.isAuthenticated = false;
            Cookies.remove('salonToken');
            Cookies.remove('customerToken');
            Cookies.remove('adminToken');
        },
        setLoading: (state,action) =>{
            state.loading = action.payload.loading
        },
    }
});
export const {setLiveLocation, loginSuccess, logout, setLoading} = authSlice.actions;
export default authSlice.reducer;
