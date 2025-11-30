import React from "react";
import "./style.scss";
import { ArticleWithUserData } from "../../store/slices/types/ArticlesSlice.models";
import { formatDate } from "../../utils/dateUtils";
import eyeIcon from "../../assets/eyeIcon.png"

type ArticlePageProps = {
  article: ArticleWithUserData;
}

const ArticlePage: React.FC<ArticlePageProps> = ( {article}) => {
  return (
    <div className="article-page-container">
      <div className="article-main-layout">

        <div className="back-link">
          <a href="/all-articles">All articles</a>
        </div>

        <div className="article-content-wrapper">
          <div className="article-header">
            <div className="category">#{article.category}</div>
            <h1 className="title">{article.title}</h1>
          </div>

          <div
            className="article-body"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          <div className="article-footer">
            <div className="author-block">
              {article.authorAvatar ? (
                <img className="avatar" src={article.authorAvatar} alt={article.authorName} />
              ) : (
                <div className="avatar placeholder">{article.authorName[0]}</div>
              )}

              <div className="meta">
                <div className="name">{article.authorName}</div>
                <div className="sub">{formatDate(article.createdAt)} · {article.readTime} min read</div>
                <span className="article-views">
                  <img src={eyeIcon}/>
                  {article.views ?? 0}
                </span>
              </div>
            </div>

            <div className="tag">{article.category}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;
