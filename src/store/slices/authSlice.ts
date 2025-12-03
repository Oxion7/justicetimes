import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LoginFormData } from "../../validation/authValidation";
import {
  clearAllAuthData,
  getStoredCurrentUser,
  getStoredToken,
  getStoredUsers,
  getUserByEmail,
  isTokenExpired as checkTokenExpired,
  saveUser,
  setStoredCurrentUser,
  setStoredToken,
} from "../../utils/AuthLocalStorage";
import { generateToken, isTokenExpired } from "../../utils/JWT";

import { generateUserId } from "./utils/generateUserId";
import { AuthState, RegisterPayload, User } from "./types/authSlice.models";
import { STORAGE_KEYS } from "./const";

const initialState: AuthState = {
  user: getStoredCurrentUser(),
  token: getStoredToken(),
  isLoading: false,
  error: null,
  isAuthenticated: !!getStoredToken() && !checkTokenExpired(),
  users: getStoredUsers(),
};
const USERS_STORAGE_KEY = STORAGE_KEYS.USERS;

// Async thunks
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData: RegisterPayload, { rejectWithValue }) => {
    try {
      const existingUser = getUserByEmail(userData.email);
      if (existingUser) return rejectWithValue("User with this email already exists");

      const newUser: User = {
        id: generateUserId(),
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        createdAt: new Date().toISOString(),
        description: "",
        avatar: null,
      };

      saveUser(newUser);
      const token = generateToken(
        parseInt(newUser.id),
        newUser.email,
        `${newUser.firstName} ${newUser.lastName}`,
      );

      return { user: newUser, token };
    } catch (error) {
      return rejectWithValue("Registration failed. Please try again.");
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: LoginFormData, { rejectWithValue }) => {
    try {
      const user = getUserByEmail(credentials.email);
      if (!user) return rejectWithValue("Invalid email or password");

      if (user.password !== credentials.password) return rejectWithValue("Invalid email or password");
      const token = generateToken(
        parseInt(user.id),
        user.email,
        `${user.firstName} ${user.lastName}`,
      );

      return { user, token };
    } catch (error) {
      return rejectWithValue("Login failed. Please try again.");
    }
  },
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      clearAllAuthData();
      return;
    } catch (error) {
      return rejectWithValue("Logout failed");
    }
  },
);

// Check existing auth
export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const token = getStoredToken();
      const user = getStoredCurrentUser();

      if (!token || !user) {
        clearAllAuthData();
        return rejectWithValue("No valid authentication found");
      }

      if (isTokenExpired(token)) {
        clearAllAuthData();
        return rejectWithValue("Session expired. Please login again.");
      }

      return { user, token };
    } catch (error) {
      clearAllAuthData();
      return rejectWithValue("Authentication check failed");
    }
  },
);
export const updateUserProfile = createAsyncThunk(
  "auth/updateProfile",
  async (userData: Partial<User>, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      const currentUser = state.auth.user;

      if (!currentUser) {
        return rejectWithValue("No user found");
      }

      const updatedUser = {
        ...currentUser,
        ...userData,
      };

      setStoredCurrentUser(updatedUser);

      const users = getStoredUsers();
      const userIndex = users.findIndex((user) => user.id === currentUser.id);
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      }

      return updatedUser;
    } catch (error) {
      return rejectWithValue("Failed to update profile");
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCredentials: (
      state,
      { payload }: PayloadAction<{ user: User; token: string }>,
    ) => {
      state.user = payload.user;
      state.token = payload.token;
      state.isAuthenticated = true;
      setStoredCurrentUser(payload.user);
      setStoredToken(payload.token);
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;

        setStoredToken(action.payload.token);
        setStoredCurrentUser(action.payload.user);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;

        setStoredToken(action.payload.token);
        setStoredCurrentUser(action.payload.user);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
      })
      // Check Auth
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      // Update User Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;

        const userIndex = state.users.findIndex(
          (user) => user.id === action.payload.id,
        );
        if (userIndex !== -1) {
          state.users[userIndex] = action.payload;
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setCredentials } = authSlice.actions;
export default authSlice.reducer;
