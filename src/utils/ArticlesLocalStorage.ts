import { STORAGE_KEYS } from "../store/slices/const";
import { Article } from "../store/slices/types/ArticlesSlice.models";

const ARTICLES_STORAGE_KEY = STORAGE_KEYS.ARTICLES_STORAGE_KEY;

export const getStoredArticles = (): Article[] => {
  if (typeof window === "undefined") return [];
  try {
    const articles = localStorage.getItem(ARTICLES_STORAGE_KEY);
    return articles ? JSON.parse(articles) : [];
  } catch (error) {
    console.error("Error getting stored articles:", error);
    return [];
  }
};

export const saveArticle = (article: Article): Article => {
  try {
    const articles = getStoredArticles();
    const existingArticleIndex = articles.findIndex((a) => a.id === article.id);

    if (existingArticleIndex !== -1) {
      articles[existingArticleIndex] = article;
    } else {
      articles.push(article);
    }

    localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(articles));
    return article;
  } catch (error) {
    throw error;
  }
};

export const getArticlesByAuthor = (authorId: string): Article[] => {
  const articles = getStoredArticles();
  return articles.filter((article) => article.authorId === authorId);
};

export const generateArticleId = (): string => {
  return (
    "article_" +
    Math.random().toString(36).substring(2) +
    Date.now().toString(36)
  );
};
export const getAllArticlesSorted = (): Article[] => {
  const articles = getStoredArticles();
  // Sort by creation date
  return articles.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
};
