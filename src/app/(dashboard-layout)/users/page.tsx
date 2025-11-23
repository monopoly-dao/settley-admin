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
    <section className='h-full overflow-y-auto'>
      <h1 className='font-merriweather font-light text-3xl'>Users</h1>

      <div className='my-5 flex flex-col md:flex-row gap-1 md:gap-4'>
        <InputSearch placeholder='Search for user name, wallet address' />
        <Button
          onClick={() => exportToExcel(res?.data || [], 'user-data.xlsx')}
        >
          Export
        </Button>
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
    </section>
  );
}
