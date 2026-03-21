import { GET_METHOD, POST_METHOD, PUT_METHOD } from '@/constants/appConstants';

import { ApplicationsEndpoints } from './applicationsApiConstants';
import { globalApi } from '..';

export const applicationsApi = globalApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    // Admin Applications
    adminGetApplications: build.query<
      import('./applicationsApiTypes').AdminApplicationsResponse,
      {
        page?: number;
        limit?: number;
        status?: string;
        location?: string;
        minValue?: number;
        maxValue?: number;
        daysPending?: number;
      }
    >({
      query: (params) => ({
        url: ApplicationsEndpoints.Admin_Get_Applications,
        method: GET_METHOD,
        params,
      }),
      providesTags: ['Applications'],
    }),

    adminGetApplication: build.query<
      {
        success: boolean;
        data: import('./applicationsApiTypes').AdminApplicationDetail;
      },
      { applicationId: string }
    >({
      query: ({ applicationId }) => ({
        url: ApplicationsEndpoints.Admin_Get_Application.replace(
          ':applicationId',
          applicationId
        ),
        method: GET_METHOD,
      }),
      providesTags: ['Applications'],
    }),

    adminUpdateApplicationStatus: build.mutation<
      { success: boolean; data: { status: string; updatedAt: string } },
      {
        applicationId: string;
        statusData: import('./applicationsApiTypes').UpdateApplicationStatusRequest;
      }
    >({
      query: ({ applicationId, statusData }) => ({
        url: ApplicationsEndpoints.Admin_Update_Application_Status.replace(
          ':applicationId',
          applicationId
        ),
        method: PUT_METHOD,
        data: statusData,
      }),
      invalidatesTags: ['Applications'],
    }),

    adminReviewDocument: build.mutation<
      { success: boolean; data: { status: string; reviewedAt: string } },
      {
        applicationId: string;
        documentId: string;
        reviewData: import('./applicationsApiTypes').ReviewDocumentRequest;
      }
    >({
      query: ({ applicationId, documentId, reviewData }) => ({
        url: ApplicationsEndpoints.Admin_Review_Document.replace(
          ':applicationId',
          applicationId
        ).replace(':documentId', documentId),
        method: POST_METHOD,
        data: reviewData,
      }),
      invalidatesTags: ['Applications'],
    }),
  }),
});

export const {
  useAdminGetApplicationsQuery,
  useAdminGetApplicationQuery,
  useAdminUpdateApplicationStatusMutation,
  useAdminReviewDocumentMutation,
} = applicationsApi;
