import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Article, ArticlesState } from "./types/ArticlesSlice.models";

const initialState: ArticlesState = {
  articles: [],
  loading: false,
  error: null,
};

const articlesSlice = createSlice({
  name: "articles",
  initialState,
  reducers: {
    // Set loading state
    setArticlesLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Set all articles
    setArticles: (state, action: PayloadAction<Article[]>) => {
      state.articles = action.payload;
      state.loading = false;
      state.error = null;
    },

    // Set error
    setArticlesError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },

    // Add new article
    addArticle: (state, action: PayloadAction<Article>) => {
      state.articles.unshift(action.payload);
    },

    // Update existing article
    updateArticle: (state, action: PayloadAction<Article>) => {
      const index = state.articles.findIndex((a) => a.id === action.payload.id);
      if (index !== -1) state.articles[index] = action.payload;
    },
    incrementViews: (state, action: PayloadAction<string>) => {
      const article = state.articles.find((a) => a.id === action.payload);
      if (article) article.views = (article.views ?? 0) + 1;
    },
  },
});

export const {
  setArticlesLoading,
  setArticles,
  setArticlesError,
  addArticle,
  updateArticle,
  incrementViews,
} = articlesSlice.actions;

export default articlesSlice.reducer;
