import { useAppSelector } from './redux';
import { isTokenExpired } from '../utils/JWT';

export const useAuth = () => {
  const { token, user } = useAppSelector((state:any) => state.auth);

  const isAuthenticated = () => {
    if (!token) return false;
    return !isTokenExpired(token);
  };

  return {
    isAuthenticated: isAuthenticated(),
    token,
    user,
  };
};