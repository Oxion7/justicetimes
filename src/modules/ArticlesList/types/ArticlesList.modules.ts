import { ArticleWithUserData } from "../../../store/slices/types/ArticlesSlice.models";

export type ArticlesListProps = {
  articles: ArticleWithUserData[];
  showHighlighted?: boolean;
  highlightedArticle?: ArticleWithUserData | null;
  showSectionTitle?: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  emptyStateMessage?: {
    title: string;
    description: string;
  };
  showPagination?: boolean;
};
