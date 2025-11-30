import { STORAGE_KEYS } from "../store/slices/const";
import { User } from "../store/slices/types/authSlice.models";

// User management
export const getStoredUsers = (): any[] => {
  if (typeof window === "undefined") return [];
  const users = localStorage.getItem(STORAGE_KEYS.USERS);
  return users ? JSON.parse(users) : [];
};

export const saveUser = (userData: any) => {
  const users = getStoredUsers();
  const existingUserIndex = users.findIndex(
    (user) => user.email === userData.email,
  );

  if (existingUserIndex !== -1) {
    users[existingUserIndex] = userData;
  } else {
    users.push(userData);
  }

  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  return userData;
};

export const getUserByEmail = (email: string): User | null => {
  const users = getStoredUsers();
  return users.find((user) => user.email === email);
};
export const getUserById = (userId: string): User | null => {
  const users = getStoredUsers();
  return users.find((user) => user.id === userId) || null;
};

export const getUserAvatar = (user: User | null): string | undefined => {
  return user?.avatar || undefined;
};

export const getUserFullName = (user: User | null): string => {
  if (!user) return "Unknown Author";
  return `${user.firstName} ${user.lastName}`;
};

// Token management
export const getStoredToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
};

export const setStoredToken = (token: string) => {
  localStorage.setItem(STORAGE_KEYS.TOKEN, token);
};

export const removeStoredToken = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
};

// Token expiration
export const getStoredTokenExpiresAt = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRES_AT);
};

export const setStoredTokenExpiresAt = (expiresAt: string) => {
  localStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRES_AT, expiresAt);
};

export const removeStoredTokenExpiresAt = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRES_AT);
};

// Current user management
export const getStoredCurrentUser = (): any => {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return user ? JSON.parse(user) : null;
};

export const setStoredCurrentUser = (user: any) => {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
};

export const removeStoredCurrentUser = () => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
};

// Clear all auth data
export const clearAllAuthData = () => {
  removeStoredToken();
  removeStoredTokenExpiresAt();
  removeStoredCurrentUser();
};

// Check if token is expired
export const isTokenExpired = (): boolean => {
  const expiresAt = getStoredTokenExpiresAt();
  if (!expiresAt) return true;

  return new Date() > new Date(expiresAt);
};

// Generate mock token
export const generateToken = (): string => {
  return (
    "mock_token_" +
    Math.random().toString(36).substring(2) +
    Date.now().toString(36)
  );
};
//Update stored user
export const updateStoredUser = (updatedUser: any) => {
  const users = getStoredUsers();
  const userIndex = users.findIndex((user) => user.id === updatedUser.id);

  if (userIndex !== -1) {
    users[userIndex] = updatedUser;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  // Also update current user if it's the same user
  const currentUser = getStoredCurrentUser();
  if (currentUser && currentUser.id === updatedUser.id) {
    setStoredCurrentUser(updatedUser);
  }
};
