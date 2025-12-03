import React, { useEffect, useState } from "react";
import { getAllArticlesSorted } from "../../utils/ArticlesLocalStorage";
import { useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  setArticles,
  setArticlesError,
  setArticlesLoading,
} from "../../store/slices/articlesSlice";
import ArticlesList from "../ArticlesList/index";
import {
  selectHighlightedArticle,
  selectPaginatedArticles,
  selectTotalPages
} from "../../store/selectors/articlesSelector";
import { DEFAULT_PAGE } from "./const/AllArticles";

const AllArticles = () => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.articles);

  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get("page") || DEFAULT_PAGE, 10);
  const [page, setPage] = useState(isNaN(pageParam) || pageParam < 1 ? 1 : pageParam);

  const highlightedArticle = useAppSelector(selectHighlightedArticle);
  const paginatedArticles = useAppSelector(state =>
    selectPaginatedArticles(state, page)
  );
  const totalPages = useAppSelector(selectTotalPages);

  useEffect(() => {
    const fetchArticles = async () => {
      dispatch(setArticlesLoading(true));
      try {
        const sortedArticles = getAllArticlesSorted();
        dispatch(setArticles(sortedArticles));
      } catch {
        dispatch(setArticlesError("Failed to load articles"));
      } finally {
        dispatch(setArticlesLoading(false));
      }
    };
    fetchArticles();
  }, [dispatch]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (page > 1) params.set("page", String(page));
    setSearchParams(params);
  }, [page, setSearchParams]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <ArticlesList
      articles={paginatedArticles}
      showHighlighted={true}
      highlightedArticle={highlightedArticle}
      currentPage={page}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    />
  );
};

export default AllArticles;