'use client';

import { Building2, Clock, DollarSign, Phone, Wallet } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';

import { DataTable, ErrorPlaceholder } from '@/components/ui';

import { useGetUserQuery } from '@/api/users/users-action.server';

import {
  holdingsColumns,
  transactionsColumns,
} from '../_utils/holdingsColumns';

export default function Page() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });
  const { userId } = useParams<{ userId: string }>();

  const {
    data: res,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useGetUserQuery({
    userId,
  });

  const user = res?.data;

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const totalValue =
    user?.holdings.reduce((sum, holding) => {
      return sum + parseFloat(holding.units);
    }, 0) || 0;

  const holdings = user?.holdings || [];
  //   const listings = user?.listings || [];
  const transactions = user?.transactions || [];

  if (isError)
    return (
      <ErrorPlaceholder
        errorMessage='Error Fetching User'
        retryHandler={refetch}
        isLoading={isFetching}
      />
    );

  return (
    <section className='h-full overflow-y-auto'>
      <div className='max-w-7xl mx-auto space-y-6'>
        {/* Header Section */}
        <div className='bg-white rounded-lg shadow-sm p-8'>
          <div className='flex items-start gap-6'>
            {/* <Image
              src={user.userDetails.profileImage}
              alt={`${user.firstName} ${user.lastName}`}
              className='w-24 h-24 rounded-full border-4 border-gray-100'
            /> */}
            <div className='flex-1'>
              <div className='flex items-center gap-3 mb-2'>
                <h1 className='text-3xl font-bold text-gray-900'>
                  {user?.firstName} {user?.lastName}
                </h1>
                {/* <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    user?.userDetails.status
                  )}`}
                >
                  {user?.userDetails.status}
                </span> */}
                {user?.role === 'admin' && (
                  <span className='px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800'>
                    Admin
                  </span>
                )}
              </div>
              <p className='text-lg text-gray-600 mb-4'>
                @{user?.userDetails.username}
              </p>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {user?.userDetails.phone && (
                  <div className='flex items-center gap-2 text-gray-600'>
                    <Phone className='w-4 h-4' />
                    <span>{user?.userDetails.phone}</span>
                  </div>
                )}
                {user?.userDetails.twitter && (
                  <div className='flex items-center gap-2 text-gray-600'>
                    <span className='font-medium'>Twitter:</span>
                    <span>{user?.userDetails.twitter}</span>
                  </div>
                )}
                <div className='flex items-center gap-2 text-gray-600'>
                  <Wallet className='w-4 h-4' />
                  <span className='font-mono text-sm'>
                    {truncateAddress(user?.userDetails.walletAddress || '')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
          <div className='bg-white rounded-lg shadow-sm p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-600 mb-1'>Total Holdings</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {user?.holdings?.length || 0}
                </p>
              </div>
              <Building2 className='w-8 h-8 text-blue-500' />
            </div>
          </div>

          <div className='bg-white rounded-lg shadow-sm p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-600 mb-1'>Total Units</p>
                <p className='text-2xl font-bold text-gray-900'>{totalValue}</p>
              </div>
              <DollarSign className='w-8 h-8 text-green-500' />
            </div>
          </div>

          {/* <div className='bg-white rounded-lg shadow-sm p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-600 mb-1'>Listed Units</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {user?.ownership?.listedPositions?.reduce(
                    (sum, pos) => sum + parseFloat(pos.units),
                    0
                  ) || 0}
                </p>
              </div>
              <MapPin className='w-8 h-8 text-purple-500' />
            </div>
          </div> */}

          <div className='bg-white rounded-lg shadow-sm p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-600 mb-1'>Transactions</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {user?.transactions?.length || 0}
                </p>
              </div>
              <Clock className='w-8 h-8 text-orange-500' />
            </div>
          </div>
        </div>
      </div>

      <div className='my-5'>
        <div className='flex items-center mb-5 justify-between'>
          <h3>Holdings</h3>
        </div>

        <DataTable
          data={holdings}
          columns={holdingsColumns}
          pagination={pagination}
          setPagination={setPagination}
          hidePagination
          pageCount={1}
          totalItems={1}
          isLoading={isLoading}
          isError={isError}
          isFetching={isFetching}
          refetch={refetch}
          // errorMessage={AppError.getServerErrorMessage(error)}
        />
      </div>

      <div className='my-5'>
        <div className='flex items-center mb-5 justify-between'>
          <h3>Transactions</h3>
        </div>

        <DataTable
          data={transactions}
          columns={transactionsColumns}
          pagination={pagination}
          setPagination={setPagination}
          hidePagination
          pageCount={1}
          totalItems={1}
          isLoading={isLoading}
          isError={isError}
          isFetching={isFetching}
          refetch={refetch}
          // errorMessage={AppError.getServerErrorMessage(error)}
        />
      </div>

      {/* <div className='my-5'>
        <div className='flex items-center mb-5 justify-between'>
          <h3>Listed Positions</h3>
        </div>

        <DataTable
          data={listings}
          columns={listingsColumns}
          pagination={pagination}
          setPagination={setPagination}
          hidePagination
          pageCount={1}
          totalItems={1}
          isLoading={isLoading}
          isError={isError}
          isFetching={isFetching}
          refetch={refetch}
          // errorMessage={AppError.getServerErrorMessage(error)}
        />
      </div> */}
    </section>
  );
}
