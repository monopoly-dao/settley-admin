'use client';

import { ArrowLeft, Copy, User, Wallet } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { cn } from '@/lib/utils';

import { DataTable, ErrorPlaceholder } from '@/components/ui';

import { useGetUserQuery } from '@/api/users/users-action.server';
import { handleErrors } from '@/utils/error';

import {
  holdingsColumns,
  transactionsColumns,
} from '../_utils/holdingsColumns';

const views = ['Overview', 'Holdings & Portfolio', 'Transactions'];

export default function Page() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });
  const { userId } = useParams<{ userId: string }>();
  const router = useRouter();
  const [view, setView] = useState('Overview');

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

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(
        user?.userDetails.walletAddress || ''
      );
      toast.success('Address succesfully copied!');
    } catch (e) {
      handleErrors(e);
    }
  }

  if (isError)
    return (
      <ErrorPlaceholder
        errorMessage='Error Fetching User'
        retryHandler={refetch}
        isLoading={isFetching}
      />
    );

  return (
    <section className='h-full overflow-y-auto px-[5%] lg:px-10 xl:px-20'>
      <div className='max-w-7xl mx-auto space-y-6'>
        {/* Header Section */}

        <div className='flex items-center gap-4'>
          <button
            onClick={() => router.back()}
            className='w-8 h-8 rounded-[6px] border flex items-center justify-center'
          >
            <ArrowLeft className='w-4 h-4' />
          </button>
          <div>
            <h1 className='font-bold text-2xl font-serif tracking-tight'>
              {user?.firstName} {user?.lastName}
            </h1>
            <div className='flex items-center gap-2 text-sm mt-1 text-gray-500'>
              <span>ID: {user?.userFirebaseId}</span>
            </div>
          </div>
        </div>

        <div className='p-[3px] h-9 inline-flex w-fit items-center justify-center rounded-lg bg-[#F2F2F2] mb-6'>
          {views.map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                'rounded-[6px] border py-1 px-2 bg-transparent border-transparent text-sm font-medium hover:bg-white/50',
                [view === v && 'bg-white border-white shadow-sm']
              )}
            >
              {v}
            </button>
          ))}
        </div>

        {view === 'Overview' && (
          <div className='grid gap-6 md:grid-cols-3'>
            <div className='shadow-sm p-6 border flex flex-col gap-6 rounded-xl'>
              <div className='flex items-center gap-2'>
                <User className='text-gray-500 text-sm' />
                <p>Identity & Location</p>
              </div>

              <div className='grid grid-cols-2 gap-4 text-sm'>
                <div>
                  <p className='text-gray-500'>Username</p>
                  <p className='font-medium'>@{user?.userDetails.username}</p>
                </div>
                <div>
                  <p className='text-gray-500'>Phone</p>
                  <p className='font-medium'>{user?.userDetails.phone}</p>
                </div>
                <div>
                  <p className='text-gray-500'>Twitter</p>
                  <p className='font-medium'>{user?.userDetails.twitter}</p>
                </div>
              </div>
            </div>

            <div className='shadow-sm p-6 border flex flex-col gap-6 rounded-xl'>
              <div className='flex items-center gap-2'>
                <Wallet className='text-gray-500 text-sm' />
                <p>Financial Overview</p>
              </div>

              <div className='space-y-4'>
                <div>
                  <p className='text-sm text-gray-500 mb-1'>Connected Wallet</p>
                  <div className='flex items-center justify-between rounded-md bg-gray-200 font-mono border p-2'>
                    {truncateAddress(user?.userDetails.walletAddress || '')}
                    <button onClick={copyAddress}>
                      <Copy className='w-4 h-4' />
                    </button>
                  </div>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='text-sm text-gray-500'>Total Invested</p>
                  <p className='text-2xl font-bold'>${totalValue}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Properties</p>
                  <p className='text-2xl font-bold'>
                    {user?.holdings?.length || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'Holdings & Portfolio' && (
          <>
            <div className='lg:col-span-2 flex flex-col gap-6 w-full bg-white p-6 rounded-xl shadow-sm border'>
              <div className='mb-4'>
                <p className='font-medium'>Property Holdings</p>
                <p className='text-xs text-gray-500'>
                  Detailed breakdown of all real estate tokens held by this user
                </p>
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
          </>
        )}

        {view === 'Transactions' && (
          <>
            <div className='lg:col-span-2 flex flex-col gap-6 w-full bg-white p-6 rounded-xl shadow-sm border'>
              <div className='mb-4'>
                <p className='font-medium'>Transactions</p>
                <p className='text-xs text-gray-500'>
                  Detailed breakdown of all transactions performed by this user
                </p>
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
          </>
        )}
      </div>
    </section>
  );
}
