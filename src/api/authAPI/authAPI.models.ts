export type RegisterRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export type LoginRequest = {
  email: string;
  password: string;
}

export type RegisterResponse = {
  message: string;
  authorId: number;
}

export type LoginResponse  ={
  token: string;
  expiresAt: string;
  name: string;
  authorId: number;
}

export type Author = {
  id: number;
  name: string;
  bio: string;
  articles: Article[];
  userId: string;
}

export type Article  ={
  id: number;
  title: string;
  summary: string;
  content: string;
  publishedAt: string;
  authorId: number;
  author: string;
  categoryId: number;
  category: Category;
}

export type Category = {
  id: number;
  name: string;
  articles: string[];
}