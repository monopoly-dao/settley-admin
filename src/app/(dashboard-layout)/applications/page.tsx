'use client';

import Link from 'next/link';
import React, { useState } from 'react';

import { useAdminGetApplicationsQuery } from '@/api/applications';
import {
  AdminApplication,
  ApplicationStatus,
  isValidApplicationStatus,
} from '@/api/applications/applicationsApiTypes';

import ApplicationFilters from '../_components/ApplicationFilters';
import StatusBadge from '../_components/StatusBadge';

export default function AdminApplicationsPage() {
  const [filters, setFilters] = useState<{
    page: number;
    limit: number;
    status: string;
    location: string;
    minValue?: number;
    maxValue?: number;
    daysPending?: number;
  }>({
    page: 1,
    limit: 20,
    status: '',
    location: '',
    minValue: undefined,
    maxValue: undefined,
    daysPending: undefined,
  });

  const {
    data: applicationsData,
    isLoading,
    error,
  } = useAdminGetApplicationsQuery(filters);
  const applications: AdminApplication[] = applicationsData?.data || [];
  const pagination = applicationsData?.pagination;
  const stats = applicationsData?.stats;

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  if (isLoading) {
    return (
      <div className='p-8'>
        <div className='flex justify-center items-center min-h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-navy'></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='p-8'>
        <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
          <p className='text-red-800'>
            {error instanceof Error
              ? error.message
              : 'Failed to fetch applications'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='p-8 overflow-y-auto h-full'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-navy mb-2'>Applications</h1>
        <p className='text-settley-text'>
          Manage and review property applications
        </p>
      </div>

      {/* Stats */}
      {stats && (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
          <div className='bg-white p-6 rounded-lg border border-navy/5 shadow-sm'>
            <h3 className='text-sm font-medium text-medium-grey mb-2'>
              Total Pending
            </h3>
            <p className='text-2xl font-bold text-navy'>{stats.totalPending}</p>
          </div>
          <div className='bg-white p-6 rounded-lg border border-navy/5 shadow-sm'>
            <h3 className='text-sm font-medium text-medium-grey mb-2'>
              Average SLA
            </h3>
            <p className='text-2xl font-bold text-navy'>
              {stats.averageSLA} days
            </p>
          </div>
          <div className='bg-white p-6 rounded-lg border border-navy/5 shadow-sm'>
            <h3 className='text-sm font-medium text-medium-grey mb-2'>
              Total Applications
            </h3>
            <p className='text-2xl font-bold text-navy'>
              {pagination?.total || 0}
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <ApplicationFilters
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      {/* Applications Table */}
      <div className='bg-white rounded-lg border border-navy/5 shadow-sm overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50 border-b border-navy/5'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-medium-grey uppercase tracking-wider'>
                  Application ID
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-medium-grey uppercase tracking-wider'>
                  Property Address
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-medium-grey uppercase tracking-wider'>
                  Owner
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-medium-grey uppercase tracking-wider'>
                  Estimated Value
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-medium-grey uppercase tracking-wider'>
                  Status
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-medium-grey uppercase tracking-wider'>
                  Days Pending
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-medium-grey uppercase tracking-wider'>
                  Submitted
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-medium-grey uppercase tracking-wider'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-navy/5'>
              {applications.map((application: AdminApplication) => {
                const safeStatus = isValidApplicationStatus(application.status)
                  ? application.status
                  : ('submitted' as ApplicationStatus);

                return (
                  <tr key={application._id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-navy'>
                      {application.applicationId}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-navy'>
                      {application.propertyAddress}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div>
                        <div className='text-sm font-medium text-navy'>
                          {application.ownerName}
                        </div>
                        <div className='text-sm text-settley-text'>
                          {application.ownerEmail}
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-navy'>
                      {application.estimatedValue}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <StatusBadge status={safeStatus} />
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-navy'>
                      {application.daysPending}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-settley-text'>
                      {new Date(application.submittedAt).toLocaleDateString()}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                      <Link
                        href={`/applications/${application._id}`}
                        className='text-navy hover:text-navy/80'
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {applications.length === 0 && (
          <div className='text-center py-12'>
            <p className='text-settley-text'>
              No applications found matching your criteria.
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className='flex items-center justify-between mt-6'>
          <div className='text-sm text-settley-text'>
            Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} results
          </div>
          <div className='flex gap-2'>
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className='px-4 py-2 text-sm font-medium text-navy bg-white border border-navy/5 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Previous
            </button>
            <span className='px-4 py-2 text-sm font-medium text-navy bg-white border border-navy/5 rounded-md'>
              {pagination.page} / {pagination.pages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.pages}
              className='px-4 py-2 text-sm font-medium text-navy bg-white border border-navy/5 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
