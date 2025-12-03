import { getStoredCurrentUser, getStoredToken } from "./AuthLocalStorage";
import { isTokenExpired } from "./JWT";

export const checkIsLoggedIn = (): boolean => {
  const token = getStoredToken();
  const user = getStoredCurrentUser();

  if (!token || !user) return false;

  try {
    if (isTokenExpired(token)) return false;
  } catch (error) {
    console.error("Error checking token expiration:", error);
    return false;
  }

  return true;
};
