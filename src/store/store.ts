import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import articlesReducer from "./slices/articlesSlice";
import { localStorageMiddleware } from "./middleware/localStorageMiddleware";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    articles: articlesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type Dispatch = typeof store.dispatch;
