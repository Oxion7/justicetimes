import React from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/dateUtils";
import { getInitials } from "../../utils/stringUtils";
import "./style.scss";
import { ArticlesListProps } from "./types/ArticlesList.modules";
import Pagination from "../Pagination";
import eyeIcon from "../../assets/eyeIcon.png";

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
                                                       description: "Be the first to write an article and share your thoughts with the community."
                                                     },
                                                     showPagination = true
                                                   }) => {
  const extractPreviewFromHTML = (html: string): string => {
    if (!html) return '';

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    const images = tempDiv.querySelectorAll('img');
    images.forEach(img => img.remove());

    const firstHeading = tempDiv.querySelector('h1, h2, h3, h4, h5, h6');
    if (firstHeading) {
      let textContent = '';
      let nextElement = firstHeading.nextElementSibling;

      while (nextElement && textContent.length < 150) {
        if (nextElement.textContent) {
          textContent += nextElement.textContent + ' ';
        }
        nextElement = nextElement.nextElementSibling;
      }

      const trimmed = textContent.trim();
      if (trimmed) {
        return trimmed.slice(0, 150) + (trimmed.length > 150 ? '...' : '');
      }
    }

    const firstParagraph = tempDiv.querySelector('p');
    if (firstParagraph) {
      const text = firstParagraph.textContent?.trim() || '';
      return text.slice(0, 150) + (text.length > 150 ? '...' : '');
    }

    const textContent = tempDiv.textContent?.trim() || '';
    return textContent.slice(0, 150) + (textContent.length > 150 ? '...' : '');
  };

  const extractFirstImageFromHTML = (html: string): string | null => {
    if (!html) return null;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    const firstImage = tempDiv.querySelector('img');
    if (firstImage && firstImage.src) {
      return firstImage.src;
    }

    return null;
  };

  const hasArticles = articles.length > 0 || (showHighlighted && highlightedArticle);

  return (
    <div className="all-articles-container">
      <div className="all-articles-content">
        {showHighlighted && currentPage === 1 && highlightedArticle && (
          <section className="highlighted-article">
            <Link to={`/article/${highlightedArticle.id}`} className="highlight-link">
              <div className="highlight-inner">
                {extractFirstImageFromHTML(highlightedArticle.content) && (
                  <div className="highlight-image">
                    <img
                      src={extractFirstImageFromHTML(highlightedArticle.content) ?? undefined}
                      alt={highlightedArticle.title}

                    />
                  </div>
                )}
                <div className="highlight-body">
                  <div className="highlight-category">#{highlightedArticle.category}</div>
                  <h2 className="highlight-title">{highlightedArticle.title}</h2>
                  <div className="highlight-excerpt">
                    {extractPreviewFromHTML(highlightedArticle.content)}
                  </div>
                  <div className="highlight-meta">
                    <div className="author-info">
                      <div className="author-avatar">
                        {highlightedArticle.authorAvatar ? (
                          <img
                            src={highlightedArticle.authorAvatar}
                            alt={highlightedArticle.authorName}
                          />
                        ) : (
                          <span>{getInitials(highlightedArticle.authorName)}</span>
                        )}
                      </div>
                      <Link
                        to={`/profile/${highlightedArticle.authorId}/articles`}
                        className="author-name-link"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="author-name">{highlightedArticle.authorName}</span>
                      </Link>
                    </div>
                    <div className="highlight-stats">
                      <span className="highlight-date">{formatDate(highlightedArticle.createdAt)}</span>
                      <span className="dot-sep">•</span>
                      <span className="highlight-read-time">{highlightedArticle.readTime} min read</span>
                      <span className="dot-sep">•</span>
                      <span className="highlight-views">
                        <img src={eyeIcon} alt="views"/>
                        {highlightedArticle.views ?? 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
            <div className="highlight-divider" />
          </section>
        )}

        <section className="popular-articles">
          {showSectionTitle && <h2 className="section-title">Popular articles</h2>}
          <div className="articles-list">
            {articles.map(article => (
              <article key={article.id} className="article-item">
                <Link to={`/article/${article.id}`} className="article-link">
                  <div className="article-row">
                    {extractFirstImageFromHTML(article.content) && (
                      <div className="article-thumb">
                        <img
                          src={extractFirstImageFromHTML(article.content) ?? undefined}
                          alt={article.title}
                        />
                      </div>
                    )}
                    <div className="article-right">
                      <div className="article-top">
                        <div className="article-category">#{article.category}</div>
                        <h3 className="article-title">{article.title}</h3>
                      </div>
                      <div className="article-excerpt">
                        {extractPreviewFromHTML(article.content)}
                      </div>
                      <div className="article-meta">
                        <div className="author-info">
                          <div className="author-avatar">
                            {article.authorAvatar ? (
                              <img
                                src={article.authorAvatar}
                                alt={article.authorName}
                              />
                            ) : (
                              <span>{getInitials(article.authorName)}</span>
                            )}
                          </div>
                          <Link
                            to={`/profile/${article.authorId}/articles`}
                            className="author-name-link"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span className="author-name">{article.authorName}</span>
                          </Link>
                        </div>
                        <div className="article-stats">
                          <span className="article-date">{formatDate(article.createdAt)}</span>
                          <span className="dot-sep">•</span>
                          <span className="article-read-time">{article.readTime} min read</span>
                          <span className="dot-sep">•</span>
                          <span className="article-views">
                            <img src={eyeIcon} alt="views"/>
                            {article.views ?? 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
                <div className="article-separator" />
              </article>
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