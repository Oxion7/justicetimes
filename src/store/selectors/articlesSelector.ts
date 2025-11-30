import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { getHighlightedArticle } from "../../utils/highlightUtils";
import { selectAllUsers } from "./authSelector";
import {ArticleWithUserData} from "../slices/types/ArticlesSlice.models";

export const selectArticlesWithUserData = createSelector(
  [(state: RootState) => state.articles.articles, selectAllUsers],
  (articles, users): ArticleWithUserData[] => {
    const usersMap = new Map(users.map(user => [user.id, user]));

    return articles.map(article => {
      const user = usersMap.get(article.authorId);
      return {
        ...article,
        authorName: user ? `${user.firstName} ${user.lastName}` : 'Unknown Author',
        authorAvatar: user?.avatar || undefined,
        isHighlighted: false,
      };
    });
  }
);

export const selectPreparedArticles = createSelector(
  [selectArticlesWithUserData],
  (articlesWithUsers): ArticleWithUserData[] => {
    return articlesWithUsers;
  }
);

export const selectHighlightedArticle = createSelector(
  [selectPreparedArticles],
  (preparedArticles): ArticleWithUserData | null => {
    const highlighted = getHighlightedArticle(preparedArticles);
    if (!highlighted) return null;
    return highlighted;
  }
);

export const selectArticlesForPagination = createSelector(
  [selectPreparedArticles, selectHighlightedArticle],
  (preparedArticles, highlightedArticle): ArticleWithUserData[] => {
    return preparedArticles.filter(
      article => !highlightedArticle || article.id !== highlightedArticle.id
    );
  }
);

export const selectPaginatedArticles = createSelector(
  [selectArticlesForPagination, (state: RootState, page: number) => page],
  (articlesForPagination, page): ArticleWithUserData[] => {
    const total = articlesForPagination.length;

    // Pagination calc
    let startIndex = page === 1 ? 0 : 6 + (page - 2) * 7;
    let endIndex = page === 1 ? Math.min(6, total) : Math.min(startIndex + 7, total);

    return articlesForPagination.slice(startIndex, endIndex);
  }
);

export const selectTotalPages = createSelector(
  [selectArticlesForPagination],
  (articlesForPagination): number => {
    const total = articlesForPagination.length;
    return total <= 6 ? 1 : 1 + Math.ceil((total - 6) / 7);
  }
);
export const selectUserArticles = createSelector(
  [selectArticlesWithUserData, (state: RootState, userId: string) => userId],
  (articlesWithUserData, userId): ArticleWithUserData[] => {
    return articlesWithUserData.filter(article => article.authorId === userId);
  }
);

export const selectUserArticlesPagination = createSelector(
  [selectUserArticles, (state: RootState, userId: string, page: number) => page],
  (userArticles, page) => {
    const ARTICLES_PER_PAGE = 7;
    const totalItems = userArticles.length;
    const totalPages = Math.ceil(totalItems / ARTICLES_PER_PAGE);
    const currentPage = Math.max(1, Math.min(page, totalPages || 1));
    const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
    const endIndex = startIndex + ARTICLES_PER_PAGE;

    return {
      items: userArticles.slice(startIndex, endIndex),
      totalItems,
      totalPages,
      currentPage,
      hasNext: currentPage < totalPages,
      hasPrev: currentPage > 1,
    };
  }
);