import { configureStore } from '@reduxjs/toolkit';
import bagReducer from './bagslice';
import userReducer from './userSlice';
const store = configureStore({
  reducer: {
    bag: bagReducer,
    user: userReducer,
  },
});

export default store;