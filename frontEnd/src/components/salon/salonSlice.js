import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  openSidebar: true,
  profile: {},
};
const salonSlice = createSlice({
  name: "salon",
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
export const { toggleSidebar, setProfile, clearProfile } = salonSlice.actions;
export default salonSlice.reducer;
