import { configureStore } from '@reduxjs/toolkit';
import bagReducer from './bagslice';
import userReducer from './userSlice';
import wishlistReducer from './wishlistSlice';
const store = configureStore({
  reducer: {
    bag: bagReducer,
    user: userReducer,
    wishlist: wishlistReducer,
  },
});

export default store;