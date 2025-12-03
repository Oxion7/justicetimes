import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import ArticlePage from "../index";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { selectArticlesWithUserData } from "../../../store/selectors/articlesSelector";
import { incrementViews } from "../../../store/slices/articlesSlice";

const ArticlePageContainer = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (id) dispatch(incrementViews(id));
  }, [id, dispatch]);
  const article = useAppSelector(state =>
    selectArticlesWithUserData(state).find(article => article.id === id)
  );


  if (!article) return <p>Article not found.</p>;

  return <ArticlePage article={article} />;
};

export default ArticlePageContainer;