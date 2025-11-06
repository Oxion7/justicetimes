import { Author } from "../../../api/authAPI/authAPI.models";

export type AuthState = {
  user: null | {
    email: string;
    name: string;
    authorId: number;
  };
  token: string | null;
  expiresAt: string | null;
  isLoading: boolean;
  error: string | null;
  currentAuthor: Author | null;
}
export type LoginCredentials = {
  email: string;
  password: string;
}

export type RegisterData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
