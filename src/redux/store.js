import { configureStore, createSlice } from '@reduxjs/toolkit';

// ---------------- AUTH SLICE ----------------
const authSlice = createSlice({
  name: 'auth',
  initialState: { 
    isLoggedIn: false,
    userId: null,
  },
  reducers: {
    logInUser: (state, action) => {
      state.isLoggedIn = true;
      state.userId = action.payload;
    },
    logOutUser: (state) => {
      state.isLoggedIn = false;
      state.userId = null;
    },
  },
});

// ---------------- RESUME SLICE ----------------
const resumeSlice = createSlice({
  name: 'resume',
  initialState: {
    importedResume: null,     // 🆕 raw extracted text (before mapping)
    currentResume: null,      // mapped + structured resume being edited
    enhancedResume: null,     // payload returned from ATS-enhancement
  },
  reducers: {
    setImportedResume: (state, action) => {
      state.importedResume = action.payload;
    },
    setCurrentResume: (state, action) => {
      state.currentResume = action.payload;
    },
    setEnhancedResume: (state, action) => {
      state.enhancedResume = action.payload;
    },
    clearResume: (state) => {
      state.importedResume = null;
      state.currentResume = null;
      state.enhancedResume = null;
    },
  },
});

// ---------------- EXPORT ACTIONS ----------------
export const { 
  logInUser, 
  logOutUser 
} = authSlice.actions;

export const { 
  setImportedResume,
  setCurrentResume, 
  setEnhancedResume, 
  clearResume 
} = resumeSlice.actions;

// ---------------- CREATE STORE ----------------
const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    resume: resumeSlice.reducer,
  },
});

export default store;
