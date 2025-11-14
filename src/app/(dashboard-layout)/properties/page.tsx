'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { InputSearch } from '@/components/input';
import { DataTable } from '@/components/ui';

import { useGetPropertiesQuery } from '@/api/properties';

import { propertiesColumns } from './_utils/propertiesColumns';

export default function Page() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 15,
  });
  const searchParams = useSearchParams();
  const search = searchParams.get('search');

  const {
    data: res,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useGetPropertiesQuery({
    limit: pagination.pageSize,
    page: pagination.pageIndex + 1,
    ...(search && { search }),
  });

  return (
    <section className='h-full overflow-y-auto'>
      <h1 className='font-merriweather font-light text-3xl'>Properties</h1>

      <div className='my-5 flex flex-col md:flex-row gap-1 md:gap-4'>
        <InputSearch placeholder='Search for property name, contract address or symbol' />
      </div>

      <DataTable
        data={res?.data || []}
        columns={propertiesColumns}
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
