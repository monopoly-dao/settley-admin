import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { IoIosArrowRoundForward } from 'react-icons/io';

import { Property } from '@/api/properties/propertiesApiTypes';

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
      <div className='w-[100px] bg-medium-grey rounded-[20px] h-[10px]'>
        <div
          className='h-[10px] rounded-[20px] bg-green-500'
          style={{
            width: `${
              ((Number(row.propertyDetails.units) -
                Number(row.propertyDetails.unitsLeft)) /
                Number(row.propertyDetails.units)) *
              100
            }%`,
          }}
        />
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
