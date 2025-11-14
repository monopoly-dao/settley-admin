'use client';

import { useSession } from 'next-auth/react';

import { useGetUserDetailsQuery } from '@/api/profile';
import { useGetPropertiesQuery } from '@/api/properties';
import { propertiesColumns } from '../properties/_utils/propertiesColumns';
import { DataTable } from '@/components/ui';
import Link from 'next/link';
import { useGetUsersQuery } from '@/api/users/users-action.server';
import { usersColumns } from '../users/_utils/usersColumns';
import { useState } from 'react';

export default function Page() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const {
    data: propertiesRes,
    isLoading: isPropertiesLoading,
    isError: isPropertiesError,
    isFetching: isPropertiesFetching,
    refetch: refetchProperties,
  } = useGetPropertiesQuery({
    limit: 5,
    page: 1,
  });

  const {
    data: usersRes,
    isLoading: isUsersLoading,
    isError: isUsersError,
    isFetching: isUsersFetching,
    refetch: refetchUsers,
  } = useGetUsersQuery({
    limit: 5,
    page: 1,
  });

  const { data: profileRes, isLoading: isProfileLoading } =
    useGetUserDetailsQuery();

  return (
    <section className='h-full overflow-y-auto'>
      <h1 className='font-merriweather font-light text-3xl'>
        Welcome, {isProfileLoading && '...'}
        {!isProfileLoading && profileRes?.data.firstName}
      </h1>

      <div className='my-5'>
        <div className='flex items-center mb-5 justify-between'>
          <h3>Properties</h3>
          <Link href='/properties' className='underline'>
            See all
          </Link>
        </div>

        <DataTable
          data={propertiesRes?.data || []}
          columns={propertiesColumns}
          pagination={pagination}
          setPagination={setPagination}
          hidePagination
          pageCount={1}
          totalItems={1}
          isLoading={isPropertiesLoading}
          isError={isPropertiesError}
          isFetching={isPropertiesFetching}
          refetch={refetchProperties}
          // errorMessage={AppError.getServerErrorMessage(error)}
        />
      </div>

      <div className='my-5'>
        <div className='flex items-center mb-5 justify-between'>
          <h3>Users</h3>
          <Link href='/users' className='underline'>
            See all
          </Link>
        </div>

        <DataTable
          data={usersRes?.data || []}
          columns={usersColumns}
          pagination={pagination}
          setPagination={setPagination}
          hidePagination
          pageCount={1}
          totalItems={1}
          isLoading={isUsersLoading}
          isError={isUsersError}
          isFetching={isUsersFetching}
          refetch={refetchUsers}
          // errorMessage={AppError.getServerErrorMessage(error)}
        />
      </div>
    </section>
  );
}
