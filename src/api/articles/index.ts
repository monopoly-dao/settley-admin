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
      { slug: string }
    >({
      query: ({ slug }) => ({
        url: ArticlesEndpoints.GetArticle.replace(':slug', slug),
        method: 'GET',
      }),
      providesTags: (_r, _e, arg) => [{ type: 'Articles', id: arg.slug }],
    }),

    updateArticle: build.mutation<
      void,
      {
        payload: FormData;
        slug: string;
      }
    >({
      query: ({ slug, payload }) => ({
        url: ArticlesEndpoints.UpdateArticle.replace(':slug', slug),
        method: 'PUT',
        data: payload,
      }),
      invalidatesTags: ['Articles'],
    }),

    deleteArticle: build.mutation<
      void,
      {
        slug: string;
      }
    >({
      query: ({ slug }) => ({
        url: ArticlesEndpoints.DeleteArticle.replace(':slug', slug),
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
