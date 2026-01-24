import { configureStore, createSlice } from '@reduxjs/toolkit';

// Get user data from localStorage for initial state
const token = localStorage.getItem('token');
const userType = localStorage.getItem('userType');

const initialState = {
  user: null,
  token: token || null,
  isAuthenticated: !!token,
  userType: userType || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.userType = action.payload.userType;
      state.isAuthenticated = true;

      // Persist to localStorage
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('userType', action.payload.userType);
    },
    setUser: (state, action) => {
      // Keep this for backward compatibility if used elsewhere
      const userData = action.payload;
      state.user = userData;
      state.token = userData.access_token;
      state.isAuthenticated = true;
      state.userType = userData.user_type;

      // Persist to localStorage
      localStorage.setItem('token', userData.access_token);
      localStorage.setItem('userType', userData.user_type);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.userType = null;

      // Clear from localStorage
      localStorage.clear();
    },
  },
});

export const { setCredentials, setUser, logout } = authSlice.actions;

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
});