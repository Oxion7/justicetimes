import { Middleware } from "@reduxjs/toolkit";
import {
  addArticle,
  incrementViews,
  updateArticle,
} from "../slices/articlesSlice";
import { saveArticle } from "../../utils/ArticlesLocalStorage";
import { RootState } from "../store";

export const localStorageMiddleware: Middleware =
  (store) => (next) => (action) => {
    if (incrementViews.match(action)) {
      const state = store.getState() as RootState;
      const currentArticle = state.articles.articles.find(
        (article) => article.id === action.payload,
      );

      if (currentArticle) {
        saveArticle(currentArticle);
      }
    }
    // I save Article before reducer runs to avoid double counting
    const result = next(action);

    if (addArticle.match(action)) {
      saveArticle(action.payload);
    } else if (updateArticle.match(action)) {
      saveArticle(action.payload);
    }

    return result;
  };
