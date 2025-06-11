import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], 
};

const bagSlice = createSlice({
  name: 'bag',
  initialState,
  reducers: {
    addItemToBag: (state, action) => {
      
        state.items.push({ ...action.payload, quantity: 1 });
      
    },
    removeItemFromBag: (state, action) => {
   
        state.items = state.items.filter(item => item.bagid !== action.payload.bagid);
      
    },
    removeEntireItemFromBag: (state, action) => {
      
        state.items = state.items.filter(item => item.bagid !== action.payload.bagid);
      
    },
  },
});

export const bagActions = bagSlice.actions;
export default bagSlice.reducer;