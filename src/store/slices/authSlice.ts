import { AuthState, LoginCredentials, RegisterData } from "./types/authSlice.models";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { authAPI } from "../../api/authAPI/authAPI";
import { Author, LoginResponse, RegisterResponse } from "../../api/authAPI/authAPI.models";

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  expiresAt: localStorage.getItem("tokenExpiresAt"),
  isLoading: false,
  error: null,
  currentAuthor: null,
};

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData: RegisterData, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(userData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.responce?.data?.message || "Registration error occurred.",
      );
    }
  },
);
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login error occurred.');
    }
  }
);
export const getCurrentAuthor = createAsyncThunk(
  'auth/getCurrentAuthor',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: AuthState };
      if (!auth.token) {
        throw new Error('No token available');
      }
      const response = await authAPI.getCurrentAuthor(auth.token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch author data');
    }
  }
);
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.expiresAt = null;
      state.error = null;
      state.currentAuthor = null;
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiresAt');
    },
    clearError: (state) => {
      state.error = null;
    },
    setCredentials: (state, action: PayloadAction<{ token: string; expiresAt: string }>) => {
      state.token = action.payload.token;
      state.expiresAt = action.payload.expiresAt;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('tokenExpiresAt', action.payload.expiresAt);
    },
  },
  extraReducers: (builder) => {
    builder
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<RegisterResponse>) => {
        state.isLoading = false;
        state.error = null;
        // You can automatically log the user in after registration if needed
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.isLoading = false;
        state.error = null;
        state.token = action.payload.token;
        state.expiresAt = action.payload.expiresAt;
        state.user = {
          email: '',
          name: action.payload.name,
          authorId: action.payload.authorId,
        };

        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('tokenExpiresAt', action.payload.expiresAt);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get current author cases
      .addCase(getCurrentAuthor.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentAuthor.fulfilled, (state, action: PayloadAction<Author>) => {
        state.isLoading = false;
        state.currentAuthor = action.payload;
        if (state.user) {
          state.user.name = action.payload.name;
        }
      })
      .addCase(getCurrentAuthor.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError, setCredentials } = authSlice.actions;
export default authSlice.reducer;