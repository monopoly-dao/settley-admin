'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

import Button from '@/components/buttons/Button';
import { InputSearch } from '@/components/input';
import { DataTable } from '@/components/ui';

import { useGetUsersQuery } from '@/api/users/users-action.server';
import { exportToExcel } from '@/utils/utils';

import { usersColumns } from './_utils/usersColumns';

export default function Page() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });
  const searchParams = useSearchParams();
  const search = searchParams.get('search');

  const {
    data: res,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useGetUsersQuery({
    limit: pagination.pageSize,
    page: pagination.pageIndex + 1,
    ...(search && { search }),
  });

  return (
    <section className='h-full overflow-y-auto px-[5%] lg:px-10 xl:px-20'>
      <h1 className='text-3xl font-serif tracking-tight font-bold text-gray-900 mb-6 mt-4 lg:mt-0'>
        Users
      </h1>

      <div className='lg:col-span-2 flex flex-col gap-6 w-full bg-white p-6 rounded-xl shadow-sm border'>
        <div className='mb-4 flex items-center justify-between'>
          <div>
            <p className='font-medium'>User Management</p>
            <p className='text-xs text-gray-500'>
              View and manage all registered users
            </p>
          </div>
          <Button
            variant='outline'
            className='!py-0 h-8 text-sm !px-2.5 border-gray-500'
            onClick={() => exportToExcel(res?.data || [], 'user-data.xlsx')}
          >
            Export
          </Button>
        </div>

        <div className='mt-3 mb-2 flex flex-col md:flex-row gap-1 md:gap-4'>
          <InputSearch
            inputClassName='py-1'
            placeholder='Search for user name, wallet address'
          />
        </div>

        <DataTable
          data={res?.data || []}
          columns={usersColumns}
          pagination={pagination}
          setPagination={setPagination}
          pageCount={res?.meta.totalPages || 1}
          totalItems={1}
          isLoading={isLoading}
          isError={isError}
          isFetching={isFetching}
          refetch={refetch}
          // errorMessage={AppError.getServerErrorMessage(error)}
        />
      </div>
    </section>
  );
}
