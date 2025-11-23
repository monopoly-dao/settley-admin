import { ColumnDef } from '@tanstack/react-table';
import moment from 'moment';
import Link from 'next/link';
import { IoIosArrowRoundForward } from 'react-icons/io';

import { UserResponse } from '@/api/users/users-type.server';

export const holdingsColumns: ColumnDef<UserResponse['holdings'][number]>[] = [
  {
    header: 'Name',
    accessorKey: 'property.propertyDetails.name',
    enableSorting: true,
    sortingFn: 'alphanumeric',
  },

  {
    header: 'Ticker',
    accessorKey: 'property.propertyDetails.symbol',
  },

  {
    header: 'Contract Address',
    cell: (info) => info.getValue(),
    accessorFn: (row) => (
      <Link
        href={`https://basescan.org/address/${row.property.contractAddress}`}
        target='_blank'
        className='underline'
      >
        {row.property.contractAddress.slice(0, 6)}...
        {row.property.contractAddress.slice(-3)}
      </Link>
    ),
  },

  {
    header: 'No of Units Held',
    accessorKey: 'units',
  },

  {
    header: 'Actions',
    cell: (info) => info.getValue(),
    accessorFn: (row) => (
      <Link
        href={`/properties/${row.property._id}`}
        className='text-[#231F20CC] p-0 !text-[14px] cursor-pointer flex items-center gap-2'
      >
        View
        <IoIosArrowRoundForward />
      </Link>
    ),
  },
];

export const listingsColumns: ColumnDef<UserResponse['listings'][number]>[] = [
  {
    header: 'Name',
    accessorKey: 'property.propertyDetails.name',
    enableSorting: true,
    sortingFn: 'alphanumeric',
  },

  {
    header: 'Ticker',
    accessorKey: 'property.propertyDetails.symbol',
  },

  {
    header: 'Contract Address',
    cell: (info) => info.getValue(),
    accessorFn: (row) => (
      <Link
        href={`https://basescan.org/address/${row.property.contractAddress}`}
        target='_blank'
        className='underline'
      >
        {row.property.contractAddress.slice(0, 6)}...
        {row.property.contractAddress.slice(-3)}
      </Link>
    ),
  },

  {
    header: 'No of Units Listed',
    accessorKey: 'units',
  },

  {
    header: 'Price per unit Listed',
    cell: (info) => info.getValue(),
    accessorFn: (row) => <span>${row.pricePerUnit}</span>,
  },

  {
    header: 'Actions',
    cell: (info) => info.getValue(),
    accessorFn: (row) => (
      <Link
        href={`/properties/${row.property._id}`}
        className='text-[#231F20CC] p-0 !text-[14px] cursor-pointer flex items-center gap-2'
      >
        View
        <IoIosArrowRoundForward />
      </Link>
    ),
  },
];

export const transactionsColumns: ColumnDef<
  UserResponse['transactions'][number]
>[] = [
  {
    header: 'Transaction ID',
    accessorKey: '_id',
  },

  {
    header: 'Property Name',
    accessorKey: 'property.propertyDetails.name',
  },

  {
    header: 'Ticker',
    accessorKey: 'property.propertyDetails.symbol',
  },

  {
    header: 'Amount',
    cell: (info) => info.getValue(),
    accessorFn: (row) => <p>${row.amount.$numberDecimal}</p>,
  },

  {
    header: 'Tx Hash',
    cell: (info) => info.getValue(),
    accessorFn: (row) => (
      <Link
        href={`https://basescan.org/tx/${row.txHash}`}
        target='_blank'
        className='underline'
      >
        {row.txHash.slice(0, 6)}...
        {row.txHash.slice(-3)}
      </Link>
    ),
  },

  {
    header: 'Date',
    cell: (info) => info.getValue(),
    accessorFn: (row) => (
      <p>{moment(row.created_at).format('DD MMM, YYYY - HH:MM A')}</p>
    ),
  },

  {
    header: 'Actions',
    cell: (info) => info.getValue(),
    accessorFn: (row) => (
      <Link
        href={`/properties/${row.property._id}`}
        className='text-[#231F20CC] p-0 !text-[14px] cursor-pointer flex items-center gap-2'
      >
        View
        <IoIosArrowRoundForward />
      </Link>
    ),
  },
];
