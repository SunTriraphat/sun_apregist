"use client";
import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
  user: [],
};

const loginSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.user = action.payload;
      console.log("Redux Login", current(state));
    },
    logoutUser(state) {
      state.user = null;
    },
  },
});

export const { addUser, logoutUser } = loginSlice.actions;
export default loginSlice.reducer;
