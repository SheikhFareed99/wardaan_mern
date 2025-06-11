import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  customerId: Number(localStorage.getItem("customerId")) || 0,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCustomerId: (state, action) => {
      state.customerId = action.payload;
      localStorage.setItem("customerId", action.payload); 
    },
  },
});

export const { setCustomerId } = userSlice.actions;
export default userSlice.reducer;
