import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  openSidebar: true,
  profile: {},
};
const barberSlice = createSlice({
  name: "barber",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.openSidebar = !state.openSidebar;
    },
    setProfile: (state, action) => {
      state.profile = action.payload.profile;
    },
    clearProfile: (state) => {
      state.profile = null;
    },
  },
});
export const { toggleSidebar, setProfile, clearProfile } = barberSlice.actions;
export default barberSlice.reducer;
