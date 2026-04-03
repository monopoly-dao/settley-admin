export type ArticleResponse = {
  _id: string;
  title: string;
  slug: string;
  content: string;
  status: 'published' | 'draft';
  metaDescription?: string;
  author?: string;
  excerpt?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  coverImage: string;
};
