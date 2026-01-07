import {
  INetworkSuccessResponse,
  PaginatedSuccessResponse,
} from '@/@types/appTypes';

import { ArticlesEndpoints } from './articles-constants.server';
import { ArticleResponse } from './articles-types.server';
import { globalApi } from '..';

const articleApi = globalApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    createArticle: build.mutation<void, FormData>({
      query: (data) => ({
        url: ArticlesEndpoints.CreateArticle,
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Articles'],
    }),

    getArticles: build.query<
      PaginatedSuccessResponse<ArticleResponse[]>,
      { page?: number; limit?: number }
    >({
      query: (params) => ({
        url: ArticlesEndpoints.GetArticles,
        method: 'GET',
        params,
      }),
      providesTags: ['Articles'],
    }),

    getArticle: build.query<
      INetworkSuccessResponse<ArticleResponse>,
      { articleId: string }
    >({
      query: ({ articleId }) => ({
        url: ArticlesEndpoints.GetArticle.replace(':id', articleId),
        method: 'GET',
      }),
      providesTags: (_r, _e, arg) => [{ type: 'Articles', id: arg.articleId }],
    }),

    updateArticle: build.mutation<
      void,
      {
        payload: {
          title: string;
          content: string;
          status: string;
        };
        articleId: string;
      }
    >({
      query: ({ articleId, ...data }) => ({
        url: ArticlesEndpoints.UpdateArticle.replace(':id', articleId),
        method: 'PUT',
        data,
      }),
      invalidatesTags: ['Articles'],
    }),

    deleteArticle: build.mutation<
      void,
      {
        articleId: string;
      }
    >({
      query: ({ articleId }) => ({
        url: ArticlesEndpoints.DeleteArticle.replace(':id', articleId),
        method: 'DELETE',
      }),
      invalidatesTags: ['Articles'],
    }),
  }),
});

export const {
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
  useGetArticleQuery,
  useGetArticlesQuery,
} = articleApi;
