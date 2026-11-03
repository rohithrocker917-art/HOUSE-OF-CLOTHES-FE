import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';

// ---------------------------------------------------------------------------
// Helpers – localStorage
// ---------------------------------------------------------------------------
const loadFromStorage = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota exceeded – silently ignore */
  }
};

const clearAuthStorage = () => {
  localStorage.removeItem('hoc_user');
  localStorage.removeItem('hoc_token');
};

// ---------------------------------------------------------------------------
// Async thunks
// ---------------------------------------------------------------------------
export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await authService.signup(credentials);
      return data; // { user, token }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Signup failed',
      );
    }
  },
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await authService.login(credentials);
      return data; // { user, token }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Login failed',
      );
    }
  },
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const data = await authService.getMe();
      return data; // user object
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to fetch user',
      );
    }
  },
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const data = await authService.updateProfile(profileData);
      return data; // updated user
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Profile update failed',
      );
    }
  },
);

// ---------------------------------------------------------------------------
// Slice
// ---------------------------------------------------------------------------
const initialState = {
  user: loadFromStorage('hoc_user'),
  token: loadFromStorage('hoc_token'),
  isAuthenticated: !!loadFromStorage('hoc_token'),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      clearAuthStorage();
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ---- signup ----
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload.user;
        state.token = payload.token;
        state.isAuthenticated = true;
        saveToStorage('hoc_user', payload.user);
        saveToStorage('hoc_token', payload.token);
      })
      .addCase(signupUser.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });

    // ---- login ----
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload.user;
        state.token = payload.token;
        state.isAuthenticated = true;
        saveToStorage('hoc_user', payload.user);
        saveToStorage('hoc_token', payload.token);
      })
      .addCase(loginUser.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });

    // ---- fetchCurrentUser ----
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload.user || payload;
        state.isAuthenticated = true;
        saveToStorage('hoc_user', state.user);
      })
      .addCase(fetchCurrentUser.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
        // Token might be expired – clear auth
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        clearAuthStorage();
      });

    // ---- updateUserProfile ----
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload.user || payload;
        saveToStorage('hoc_user', state.user);
      })
      .addCase(updateUserProfile.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;

// Selectors
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;
