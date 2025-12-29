import { configureStore, createSlice } from '@reduxjs/toolkit';

// ---------------- AUTH SLICE ----------------
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
    userId: null,
    currentResumeId: null,
    API_BASE_URL: "https://resumemaker-1.onrender.com",
    API_BASE_URL2: 'http://localhost:8080',
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
    setCurrentResumeId: (state, action) => {
      state.currentResumeId = action.payload;
    },
  },
});

// ---------------- RESUME SLICE ----------------
const resumeSlice = createSlice({
  name: 'resume',
  initialState: {
    importedResume: null,     // raw extracted text (before mapping)
    currentResume: null,      // mapped + structured resume being edited
    enhancedResume: null,     // payload returned from ATS-enhancement
    globalCurrentPdf: null,   // 🆕 PDF Blob or URL stored globally
    currentTemplateName: 'modern', // 🆕 Current template key (ats, modern, twoColumn, etc.)
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
    setGlobalCurrentPdf: (state, action) => {
      state.globalCurrentPdf = action.payload;
    },
    setCurrentTemplate: (state, action) => {
      state.currentTemplateName = action.payload;
    },
    clearResume: (state) => {
      state.importedResume = null;
      state.currentResume = null;
      state.enhancedResume = null;
      state.globalCurrentPdf = null;
      state.currentTemplateName = 'modern';
    },
  },
});

// ---------------- EXPORT ACTIONS ----------------
export const {
  logInUser,
  logOutUser,
  setCurrentResumeId,
} = authSlice.actions;

export const {
  setImportedResume,
  setCurrentResume,
  setEnhancedResume,
  setGlobalCurrentPdf,
  setCurrentTemplate,
  clearResume,
} = resumeSlice.actions;

// ---------------- CREATE STORE ----------------
const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    resume: resumeSlice.reducer,
  },
});

export default store;
