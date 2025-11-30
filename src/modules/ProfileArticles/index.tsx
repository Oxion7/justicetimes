import React, { useEffect, useState } from "react";
import { getAllArticlesSorted } from "../../utils/ArticlesLocalStorage";
import { useSearchParams, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  setArticles,
  setArticlesError,
  setArticlesLoading,
} from "../../store/slices/articlesSlice";
import { selectCurrentUser } from "../../store/selectors/authSelector";
import {
  selectUserArticlesPagination,
  selectUserArticles
} from "../../store/selectors/articlesSelector";
import ArticlesList from "../ArticlesList";

const ProfileArticles = () => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.articles);
  const currentUser = useAppSelector(selectCurrentUser);

  const { userId } = useParams<{ userId: string }>();

  const targetUserId = userId || '';

  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const [page, setPage] = useState(isNaN(pageParam) || pageParam < 1 ? 1 : pageParam);

  const userArticlesPagination = useAppSelector(state =>
    selectUserArticlesPagination(state, targetUserId, page)
  );

  useAppSelector(state =>
    selectUserArticles(state, targetUserId)
  );

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
      articles={userArticlesPagination.items}
      showHighlighted={false}
      showSectionTitle={false}
      currentPage={page}
      totalPages={userArticlesPagination.totalPages}
      onPageChange={handlePageChange}
      emptyStateMessage={{
        title: "No articles yet",
        description: userId
          ? "This user hasn't written any articles yet."
          : "Start writing your first article to share your thoughts with the community."
      }}
    />
  );
};

export default ProfileArticles;