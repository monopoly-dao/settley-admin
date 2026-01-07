export type ArticleResponse = {
  _id: string;
  title: string;
  content: string;
  status: 'published' | 'draft';
  createdAt: string;
  updatedAt: string;
};
