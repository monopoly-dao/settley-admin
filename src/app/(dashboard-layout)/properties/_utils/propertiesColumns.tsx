import { ColumnDef } from '@tanstack/react-table';
import { Download, FileText } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { IoIosArrowRoundForward } from 'react-icons/io';
import { IoCopyOutline } from 'react-icons/io5';

import { Property } from '@/api/properties/propertiesApiTypes';
import { handleErrors } from '@/utils/error';

async function copyAddress(address: string) {
  try {
    await navigator.clipboard.writeText(address);
    toast.success('Address succesfully copied!');
  } catch (e) {
    handleErrors(e);
  }
}

export const propertiesColumns: ColumnDef<Property>[] = [
  {
    header: 'Name',
    accessorKey: 'propertyDetails.name',
    enableSorting: true,
    sortingFn: 'alphanumeric',
  },

  {
    header: 'Ticker',
    accessorKey: 'propertyDetails.symbol',
  },

  {
    header: 'Address',
    accessorKey: 'propertyDetails.streetAddress',
  },

  {
    header: 'State/Province',
    accessorKey: 'propertyDetails.stateOrProvince',
  },

  {
    header: 'Country',
    accessorKey: 'propertyDetails.country',
  },

  {
    header: 'Contract Address',
    cell: (info) => info.getValue(),
    accessorFn: (row) => (
      <Link
        href={`https://basescan.org/address/${row.contractAddress}`}
        target='_blank'
        className='underline'
      >
        {row.contractAddress.slice(0, 6)}...{row.contractAddress.slice(-3)}
      </Link>
    ),
  },

  {
    header: 'Total Tokens',
    accessorKey: 'propertyDetails.units',
  },

  {
    header: 'Tokens Sold',
    cell: (info) => info.getValue(),
    accessorFn: (row) =>
      Number(row.propertyDetails.units) - Number(row.propertyDetails.unitsLeft),
  },

  {
    header: 'Tokens Left',
    accessorKey: 'propertyDetails.unitsLeft',
  },

  {
    header: '% Funded',
    cell: (info) => info.getValue(),
    accessorFn: (row) => (
      <div className='h-2 bg-gray-200 w-[96px] rounded-full overflow-hidden'>
        <div
          className='h-full bg-navy rounded-full'
          style={{
            width: `${
              ((Number(row.propertyDetails.units) -
                Number(row.propertyDetails.unitsLeft)) /
                Number(row.propertyDetails.units)) *
              100
            }%`,
          }} // Use 'sold' percentage as width
          aria-valuenow={parseFloat(
            `${
              ((Number(row.propertyDetails.units) -
                Number(row.propertyDetails.unitsLeft)) /
                Number(row.propertyDetails.units)) *
              100
            }`
          )}
          aria-valuemin={0}
          aria-valuemax={100}
        ></div>
      </div>
    ),
  },

  {
    header: 'SPV Name',
    accessorKey: 'propertyDetails.name',
  },

  {
    header: 'Actions',
    cell: (info) => info.getValue(),
    accessorFn: (row) => (
      <Link
        href={`/properties/${row._id}`}
        className='text-[#231F20CC] p-0 !text-[14px] cursor-pointer flex items-center gap-2'
      >
        View More
        <IoIosArrowRoundForward />
      </Link>
    ),
  },
];

export const propertyOwnersColumns: ColumnDef<
  Property['propertyDetails']['owners'][number]
>[] = [
  {
    header: 'User ID',
    accessorKey: 'userFirebaseId',
  },

  {
    header: 'First Name',
    accessorKey: 'firstName',
  },

  {
    header: 'Last Name',
    accessorKey: 'lastName',
  },

  {
    header: 'Username',
    accessorKey: 'userDetails.username',
    cell: (info) => info.getValue(),
    accessorFn: (row) => `@${row.userDetails.username}`,
  },

  {
    header: 'Wallet Address',
    cell: (info) => info.getValue(),
    accessorFn: (row) => (
      <div
        className='flex items-center cursor-pointer gap-5'
        onClick={() => copyAddress(row.userDetails.walletAddress)}
      >
        <p>
          {row.userDetails.walletAddress.slice(0, 8)}...
          {row.userDetails.walletAddress.slice(-3)}
        </p>
        <IoCopyOutline />
      </div>
    ),
  },

  // {
  //   header: 'Total Investment(USD)',
  //   cell: (info) => info.getValue(),
  //   accessorFn: (row) => {
  //     const holdingsAmount =
  //       row?.holdings?.reduce((acc, curr) => acc + Number(curr.units), 0) || 0;
  //     const listed =
  //       row?.listings?.reduce(
  //         (acc, curr) => acc + Number(curr.pricePerUnit) * Number(curr.units),
  //         0
  //       ) || 0;
  //     const total = holdingsAmount + listed;
  //     return (
  //       <div>
  //         <p>{formatAmount(total.toString())}</p>
  //       </div>
  //     );
  //   },
  // },

  // {
  //   header: 'Number of Properties Owned',
  //   cell: (info) => info.getValue(),
  //   accessorFn: (row) => {
  //     const holdings = row?.holdings?.length || 0;
  //     return (
  //       <div>
  //         <p>{formatAmount(holdings.toString())}</p>
  //       </div>
  //     );
  //   },
  // },

  // {
  //   header: 'Total Tokens Held',
  //   cell: (info) => info.getValue(),
  //   accessorFn: (row) => {
  //     const holdingsAmount =
  //       row?.holdings?.reduce((acc, curr) => acc + Number(curr.units), 0) || 0;
  //     const listed =
  //       row?.listings?.reduce(
  //         (acc, curr) => acc + Number(curr.pricePerUnit) * Number(curr.units),
  //         0
  //       ) || 0;
  //     const total = holdingsAmount + listed;
  //     return (
  //       <div>
  //         <p>{formatAmount(total.toString())}</p>
  //       </div>
  //     );
  //   },
  // },

  {
    header: 'Actions',
    cell: (info) => info.getValue(),
    accessorFn: (row) => (
      <Link
        href={`/users/${row.userFirebaseId}`}
        className='text-[#231F20CC] p-0 !text-[14px] cursor-pointer flex items-center gap-2'
      >
        View More
        <IoIosArrowRoundForward />
      </Link>
    ),
  },
];

export const propertyDocumentsColumns: ColumnDef<{
  name: string;
  type: string;
  url: string;
}>[] = [
  {
    header: 'Document Name',
    cell: (info) => info.getValue(),
    accessorFn: (row) => (
      <div className='flex items-center gap-2'>
        <FileText className='w-4 h-4' />
        {row.name}
      </div>
    ),
  },

  {
    header: 'Type',
    accessorKey: 'type',
  },

  {
    header: 'Actions',
    cell: (info) => info.getValue(),
    accessorFn: (row) => (
      <Link href={row.url} target='_blank'>
        <Download className='w-4 h-4' />
      </Link>
    ),
  },
];
