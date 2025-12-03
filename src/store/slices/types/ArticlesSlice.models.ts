export type Article = {
  id: string;
  title: string;
  category: string;
  content: string;
  authorId: string;
  readTime: number;
  createdAt: string;
  updatedAt: string;
  views?: number;
};

export type ArticlesState = {
  articles: Article[];
  loading: boolean;
  error: string | null;
};

export interface ArticleWithUserData extends Article {
  authorName: string;
  authorAvatar?: string;
  isHighlighted: boolean;
}
