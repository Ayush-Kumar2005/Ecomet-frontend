import { createSlice } from "@reduxjs/toolkit";

// Load user from localStorage initially
const userFromStorage = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    userInfo: userFromStorage,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;

      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(action.payload));
    },

    logout: (state) => {
      state.userInfo = null;

      // Remove from localStorage
      localStorage.removeItem("user");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;