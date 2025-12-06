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
    <section className='h-full overflow-y-auto px-[5%] lg:px-10 xl:px-20'>
      <h1 className='text-3xl font-serif tracking-tight font-bold text-gray-900 mb-6 mt-4 lg:mt-0'>
        Properties
      </h1>

      <div className='lg:col-span-2 flex flex-col gap-6 w-full bg-white p-6 rounded-xl shadow-sm border'>
        <div className='mb-4'>
          <p className='font-medium'>Property Listings</p>
          <p className='text-xs text-gray-500'>
            Manage real estate assets and monitor funding progress
          </p>
        </div>

        <div className='mt-3 mb-2 flex flex-col md:flex-row gap-1 md:gap-4'>
          <InputSearch
            inputClassName='py-1'
            placeholder='Search for property name, contract address or symbol'
          />
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
      </div>
    </section>
  );
}
