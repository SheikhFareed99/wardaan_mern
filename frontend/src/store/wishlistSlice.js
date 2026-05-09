import { createSlice } from '@reduxjs/toolkit';
import { saveWishlistToLocalStorage, getWishlistFromLocalStorage } from '../utils/wishlistStorageUtils';

const initialState = {
  items: getWishlistFromLocalStorage(),
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const exists = state.items.find(item => item._id === action.payload._id);
      if (!exists) {
        state.items.push(action.payload);
        saveWishlistToLocalStorage(state.items);
      }
    },
    removeFromWishlist: (state, action) => {
      state.items = state.items.filter(item => item._id !== action.payload._id);
      saveWishlistToLocalStorage(state.items);
    },
    toggleWishlist: (state, action) => {
      const exists = state.items.find(item => item._id === action.payload._id);
      if (exists) {
        state.items = state.items.filter(item => item._id !== action.payload._id);
      } else {
        state.items.push(action.payload);
      }
      saveWishlistToLocalStorage(state.items);
    },
    clearWishlist: (state) => {
      state.items = [];
      saveWishlistToLocalStorage([]);
    },
  },
});

export const wishlistActions = wishlistSlice.actions;
export default wishlistSlice.reducer;
