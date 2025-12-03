import React from "react";
import { ArticleItemProps } from "../types/ArticlesList.modules";
import { Link } from "react-router-dom";
import { formatDate } from "../../../utils/dateUtils";
import eyeIcon from "../../../assets/eyeIcon.png";
import noPhoto from "../../../assets/noPhoto.png";

export const ArticleItem: React.FC<ArticleItemProps> = ({
  article,
  isHighlighted = false,
}) => {
  const extractPreviewFromText = (text: string): string => {
    return text?.trim().slice(0, 150) + (text.length > 150 ? "..." : "");
  };

  const extractFirstImageFromText = (text: string): string | null => {
    if (!text) return null;

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = text;

    const firstImage = tempDiv.querySelector("img");
    if (firstImage && firstImage.src) return firstImage.src;

    return null;
  };
  const excerpt = extractPreviewFromText(article.content)
  const articleImage = extractFirstImageFromText(article.content);
  const articleClass = isHighlighted ? "article-item highlight" : "article-item";

  return (
    <article key={article.id} className={articleClass}>
      <Link to={`/article/${article.id}`} className="article-link">
        <div className="article-row">
          {articleImage && (
            <div className="article-thumb">
              <img src={articleImage} alt={article.title} />
            </div>
          )}
          <div className="article-right">
            <div className="article-top">
              <div className="article-category">#{article.category}</div>
              <h3 className="article-title">{article.title}</h3>
            </div>
            <div
              className="article-excerpt"
              dangerouslySetInnerHTML={{ __html: excerpt }}
            ></div>
            <div className="article-meta">
              <Link
                to={`/profile/${article.authorId}/articles`}
                className="author-name-link"
                onClick={(e) => e.stopPropagation()}
              >
              <div className="author-info">
                <div className="author-avatar">
                  {article.authorAvatar ? (
                    <img src={article.authorAvatar} alt={article.authorName} />
                  ) : (
                    <img src={noPhoto} alt={article.authorName} />
                  )}
                </div>

                  <span className="author-name">{article.authorName}</span>

              </div>
              </Link>
              <div className="article-stats">
                <span className="article-date">
                  {formatDate(article.createdAt)}
                </span>
                <span className="dot-sep">•</span>
                <span className="article-read-time">
                  {article.readTime} min read
                </span>
                <span className="dot-sep">•</span>
                <span className="article-views">
                  <img src={eyeIcon} alt="views" />
                  {article.views ?? 0}
                </span>
              </div>
            </div>
            <div className="article-separator" />
          </div>
        </div>
      </Link>

    </article>
  );
};