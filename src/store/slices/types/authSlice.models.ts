export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  createdAt: string;
  description: string | null;
  avatar: string | null;
}

export type AuthState = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  users: User[];
}

export type RegisterPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}