import { configureStore, createSlice } from '@reduxjs/toolkit';

// Step 1: Create a slice
const authSlice = createSlice({
  name: 'auth',
  initialState: { 
    isLoggedIn: false,
    userId: null, // ✅ added userId field
  },
  reducers: {
    logInUser: (state, action) => {
      state.isLoggedIn = true;
      state.userId = action.payload; // ✅ store userId from API response
    },
    logOutUser: (state) => {
      state.isLoggedIn = false;
      state.userId = null; // ✅ reset on logout
    },
  },
});

// Step 2: Export actions
export const { logInUser, logOutUser } = authSlice.actions;

// Step 3: Create store
const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
});

export default store;
