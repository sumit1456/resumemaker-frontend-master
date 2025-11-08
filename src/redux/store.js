import { configureStore, createSlice } from '@reduxjs/toolkit';

// Step 1: Create a slice
const authSlice = createSlice({
  name: 'auth', // use a clear slice name (e.g., 'auth' instead of 'logged-in')
  initialState: { isLoggedIn: false },
  reducers: {
    logInUser: (state) => { state.isLoggedIn = true; },
    logOutUser: (state) => { state.isLoggedIn = false; },
  },
});
//renamed 
// Step 2: Export actions
export const { logInUser, logOutUser } = authSlice.actions;

// Step 3: Create the store
const store = configureStore({
  reducer: {
    auth: authSlice.reducer, // use slice name instead of 'counter'
  },
});

export default store;
