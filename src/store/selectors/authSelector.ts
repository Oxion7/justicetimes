import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectToken = (state: RootState) => state.auth.token;
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectAllUsers = (state: RootState) => state.auth.users;

export const selectUserInitials = createSelector([selectUser], (user) => {
  if (!user) return "";
  return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
});

export const selectUserFullName = createSelector([selectUser], (user) => {
  if (!user) return "";
  return `${user.firstName} ${user.lastName}`;
});

export const selectUserById = createSelector(
  [selectAllUsers, (state: RootState, userId: string) => userId],
  (users, userId) => users.find((user) => user.id === userId) || null,
);

export const selectUserByEmail = createSelector(
  [selectAllUsers, (state: RootState, email: string) => email],
  (users, email) => users.find((user) => user.email === email) || null,
);

export const selectAuthStatus = createSelector(
  [selectAuthLoading, selectIsAuthenticated, selectAuthError],
  (loading, authenticated, error) => ({
    loading,
    authenticated,
    error,
    hasError: !!error,
  }),
);
