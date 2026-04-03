import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { AiTwotoneDelete } from 'react-icons/ai';
import { FiEdit } from 'react-icons/fi';

import { ArticleResponse } from '@/api/articles/articles-types.server';

export const articlesColumns = (
  onDelete: (slug: string) => void
): ColumnDef<ArticleResponse>[] => [
  {
    header: 'Title',
    accessorKey: 'title',
    enableSorting: true,
    sortingFn: 'alphanumeric',
  },

  {
    header: 'Author',
    cell: (info) => info.getValue(),
    accessorFn: (row) => row.author || '-',
  },

  {
    header: 'Excerpt',
    cell: (info) => info.getValue(),
    accessorFn: (row) => (
      <span className='max-w-xs truncate block'>
        {row.excerpt || row.content?.substring(0, 100) + '...' || '-'}
      </span>
    ),
  },

  {
    header: 'Tags',
    cell: (info) => info.getValue(),
    accessorFn: (row) => (
      <div className='flex flex-wrap gap-1'>
        {row.tags && row.tags.length > 0 ? (
          row.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className='px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded'
            >
              {tag}
            </span>
          ))
        ) : (
          <span className='text-gray-400 text-xs'>-</span>
        )}
      </div>
    ),
  },

  {
    header: 'Created',
    cell: (info) => info.getValue(),
    accessorFn: (row) => new Date(row.createdAt).toLocaleDateString(),
  },

  {
    header: 'Status',
    cell: (info) => info.getValue(),
    accessorFn: (row) => (
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${
          row.status === 'draft'
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-800'
        }`}
      >
        {row.status}
      </span>
    ),
  },

  {
    header: 'Edit',
    cell: (info) => info.getValue(),
    accessorFn: (row) => (
      <Link
        href={`/articles/draft/${row.slug}`}
        className='text-blue-600 hover:text-blue-800 px-2 py-1 text-sm'
      >
        <FiEdit />
      </Link>
    ),
  },

  {
    header: 'Delete',
    cell: (info) => info.getValue(),
    accessorFn: (row) => (
      <button
        type='button'
        onClick={() => onDelete(row.slug)}
        className='text-red-600 hover:text-red-800 px-2 py-1 text-sm'
      >
        <AiTwotoneDelete />
      </button>
    ),
  },

  // {
  //   header: 'Actions',
  //   cell: (info) => info.getValue(),
  //   accessorFn: (row) => (
  //     <Link
  //       href={`/articles/${row.slug}`}
  //       className='text-[#231F20CC] p-0 !text-[14px] cursor-pointer flex items-center gap-2'
  //     >
  //       View More
  //       <IoIosArrowRoundForward />
  //     </Link>
  //   ),
  // },
];
