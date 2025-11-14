import { ProfileEndpoints } from './profileApiConstants';
import { UserDetailsResponse } from './profileApiTypes';
import { globalApi } from '..';
import { INetworkSuccessResponse } from '../../@types/appTypes';
import { GET_METHOD } from '../../constants/appConstants';

const profileApi = globalApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getUserDetails: build.query<
      INetworkSuccessResponse<UserDetailsResponse>,
      void
    >({
      query: () => ({
        url: ProfileEndpoints.Get_Profile_Details,
        method: GET_METHOD,
      }),
      providesTags: ['Profile'],
    }),
  }),
});

export const { useGetUserDetailsQuery } = profileApi;
