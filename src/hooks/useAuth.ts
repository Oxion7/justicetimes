import { useAppSelector } from './redux';

export const useAuth = () => {
  const { token, user } = useAppSelector((state:any) => state.auth);
  const isAuthenticated = () => {
    if (!token) return false;
    const storedToken = localStorage.getItem('token');
    return token === storedToken;
  };
  return {
    isAuthenticated: isAuthenticated(),
    token,
    user,
  };
};