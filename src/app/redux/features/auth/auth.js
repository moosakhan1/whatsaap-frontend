import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    user: null,
  },
  reducers: {
    loginAction: (state, action) => {
      const users = {
        id: action.payload.id,
        email: action.payload.email,
        name: action.payload.name,
        Pic: action.payload.Pic,
        whatappstatus: action.payload.whatappstatus,
        token: action.payload.token,
      };
      state.user = users;
      state.isLoggedIn = true;
    },
    editProfile: (state, action) => {
      state.user = {
        id: state.user.id,
        email: state.user.email,
        token: state.user.token,
        name: action.payload.name,
        Pic: action.payload.Pic,
        whatappstatus: action.payload.whatappstatus,
      };
    },
    logoutAction: (state, action) => {
      state.user = null;
    },
  },
});

export const { loginAction, logoutAction, editProfile } = authSlice.actions;

export default authSlice.reducer;
