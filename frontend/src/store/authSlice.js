import { createSlice } from '@reduxjs/toolkit';

const token = localStorage.getItem('token');
const user = (() => {
  try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
})();

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: user || null,
    token: token || null,
    isAuthenticated: !!token,
    loading: false,
    error: null,
  },
  reducers: {
    loginStart(state) { state.loading = true; state.error = null; },
    loginSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    loginFail(state, action) { state.loading = false; state.error = action.payload; },
    logoutAction(state) {
      state.user = null; state.token = null; state.isAuthenticated = false;
      localStorage.removeItem('token'); localStorage.removeItem('user');
    },
    updateUser(state, action) {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    clearError(state) { state.error = null; },
  },
});

export const { loginStart, loginSuccess, loginFail, logoutAction, updateUser, clearError } = authSlice.actions;
export default authSlice.reducer;
