import { UsersEndpoints } from './users-constants.server';
import { UserResponse } from './users-type.server';
import { globalApi } from '..';
import { PaginatedSuccessResponse } from '../../@types/appTypes';
import { GET_METHOD } from '../../constants/appConstants';

const usersApi = globalApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getUsers: build.query<
      PaginatedSuccessResponse<UserResponse[]>,
      { page?: number; limit?: number; search?: string }
    >({
      query: (payload) => ({
        url: UsersEndpoints.Get_Users,
        method: GET_METHOD,
        params: payload,
      }),
      providesTags: ['Properties'],
    }),
  }),
});

export const { useGetUsersQuery } = usersApi;
