import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { IoIosArrowRoundForward } from 'react-icons/io';
import { IoCopyOutline } from 'react-icons/io5';

import { UserResponse } from '@/api/users/users-type.server';
import { handleErrors } from '@/utils/error';

async function copyAddress(address: string) {
  try {
    await navigator.clipboard.writeText(address);
    toast.success('Address succesfully copied!');
  } catch (e) {
    handleErrors(e);
  }
}

export const usersColumns: ColumnDef<UserResponse>[] = [
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
