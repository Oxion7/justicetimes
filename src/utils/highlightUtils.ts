import { ArticleWithUserData } from "../store/slices/types/ArticlesSlice.models";

const WEEK = 7 * 24 * 60 * 60 * 1000;

export const getHighlightedArticle = (articles: ArticleWithUserData[]) => {
  if (articles.length === 0) return null;
  const now = Date.now();
  const recent = articles.filter((a) => {
    const ts = Date.parse(a.createdAt);
    return !isNaN(ts) && now - ts <= WEEK;
  });

  const pickMostViewed = (arr: ArticleWithUserData[]) => {
    if (!arr?.length) return null;
    return arr.reduce(
      (best, cur) => {
        if (!best) return cur;
        const bestViews = best.views ?? 0;
        const curViews = cur.views ?? 0;
        if (curViews > bestViews) return cur;
        if (curViews === bestViews) {
          return new Date(cur.createdAt) > new Date(best.createdAt)
            ? cur
            : best;
        }
        return best;
      },
      null as ArticleWithUserData | null,
    );
  };

  const highlighted = pickMostViewed(recent) || pickMostViewed(articles);
  return highlighted ? { ...highlighted, isHighlighted: true } : null;
};
