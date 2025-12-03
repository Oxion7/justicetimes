import React from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/dateUtils";
import { getInitials } from "../../utils/stringUtils";
import "./style.scss";
import { ArticlesListProps } from "./types/ArticlesList.modules";
import Pagination from "../Pagination";
import eyeIcon from "../../assets/eyeIcon.png";
import { ArticleItem } from "./ArticleItem/index";

const ArticlesList: React.FC<ArticlesListProps> = ({
  articles,
  showHighlighted = false,
  highlightedArticle = null,
  showSectionTitle = true,
  currentPage,
  totalPages,
  onPageChange,
  emptyStateMessage = {
    title: "No articles yet",
    description:
      "Be the first to write an article and share your thoughts with the community.",
  },
  showPagination = true,
}) => {
  const hasArticles =
    articles.length > 0;

  return (
    <div className="all-articles-container">
      <div className="all-articles-content">
        {showHighlighted &&
          currentPage === 1 &&
          highlightedArticle &&
          <ArticleItem article={highlightedArticle} isHighlighted={true}/>
        }

        <section className="popular-articles">
          {showSectionTitle && (
            <h2 className="section-title">Popular articles</h2>
          )}
          <div className="articles-list">
            {articles.map((article) => (
              <ArticleItem key={article.id} article={article} isHighlighted={false}/>
            ))}
          </div>

          {!hasArticles && (
            <div className="empty-state">
              <h2>{emptyStateMessage.title}</h2>
              <p>{emptyStateMessage.description}</p>
            </div>
          )}
        </section>

        {showPagination && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        )}
      </div>
    </div>
  );
};

export default ArticlesList;
