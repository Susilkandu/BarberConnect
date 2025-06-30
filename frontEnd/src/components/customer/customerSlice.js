import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    openSidebar: true,
    profile:{},
};
const customerSlice  = createSlice({
    name:"customer",
    initialState,
    reducers:{
        toggleSidebar: (state) =>{
            state.openSidebar = !state.openSidebar;
        },
        setProfile: (state, action) => {
            state.profile = action.payload; 
        }, 
        clearProfile: (state) =>{
            state.profile = null;
        },

    },
});
export const {toggleSidebar, setProfile, clearProfile} = customerSlice.actions;
export default customerSlice.reducer;