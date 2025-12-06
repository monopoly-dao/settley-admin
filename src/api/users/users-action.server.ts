import { UsersEndpoints } from './users-constants.server';
import { DashboardStatsResponse, UserResponse } from './users-type.server';
import { globalApi } from '..';
import {
  INetworkSuccessResponse,
  PaginatedSuccessResponse,
} from '../../@types/appTypes';
import { GET_METHOD } from '../../constants/appConstants';

const usersApi = globalApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getDashboardStats: build.query<
      INetworkSuccessResponse<DashboardStatsResponse>,
      void
    >({
      query: () => ({
        url: UsersEndpoints.GetDashboardStats,
        method: GET_METHOD,
      }),
      providesTags: ['Dashboard'],
    }),

    getUsers: build.query<
      PaginatedSuccessResponse<UserResponse[]>,
      { page?: number; limit?: number; search?: string }
    >({
      query: (payload) => ({
        url: UsersEndpoints.Get_Users,
        method: GET_METHOD,
        params: payload,
      }),
      providesTags: ['Users'],
    }),

    getUser: build.query<
      INetworkSuccessResponse<UserResponse>,
      { userId: string }
    >({
      query: ({ userId }) => ({
        url: UsersEndpoints.Get_User.replace(':userId', userId),
        method: GET_METHOD,
      }),
      providesTags: (_r, _e, arg) => [{ type: 'Users', id: arg.userId }],
    }),
  }),
});

export const { useGetUsersQuery, useGetUserQuery, useGetDashboardStatsQuery } =
  usersApi;
