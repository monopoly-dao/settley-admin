'use client';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  OnChangeFn,
  PaginationState,
  useReactTable,
} from '@tanstack/react-table';
import { Ellipsis } from 'lucide-react';
import {
  forwardRef,
  ReactNode,
  Ref,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';

import { cn } from '@/lib/utils';

import Skeleton from '@/components/Skeleton';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  ErrorPlaceholder,
  NoDataPlaceholder,
  Paginator,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui';

type DataTableRef = {
  resetPagination(): void;
};

type Props<T = unknown> = {
  data: T[];

  pageCount: number;
  totalItems: number;
  columns: ColumnDef<T>[];
  handleRowClick?(data: T): unknown;
  isLoading?: boolean;
  isFetching?: boolean;
  isError?: boolean;
  errorMessage?: string;
  debugTable?: boolean;
  pagination: PaginationState;
  setPagination: OnChangeFn<PaginationState>;
  refetch?(): void;
  className?: string;
  noDataComponent?: React.ReactNode;
  hidePagination?: boolean;
};

type DataTableSkeletonProps = {
  columns: number; // number of table columns
  rows?: number; // number of skeleton rows
  className?: string;
};

export function DataTableSkeleton({
  columns,
  rows = 5,
  className,
}: DataTableSkeletonProps) {
  return (
    <div
      className={cn(
        'w-full overflow-hidden bg-white rounded-md border',
        className,
      )}
    >
      <table className='w-full border-collapse'>
        <thead className='bg-gray-50'>
          <tr>
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className='px-4 py-3 border-b'>
                <Skeleton className='h-4 w-24' />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <tr key={rowIdx}>
              {Array.from({ length: columns }).map((_, colIdx) => (
                <td key={colIdx} className='px-4 py-3 border-b'>
                  <Skeleton className='h-4 w-32' />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function InternalDataTable<T>(props: Props<T>, ref?: Ref<DataTableRef>) {
  const {
    setPagination,
    data,
    columns,
    pageCount,
    // totalItems,
    isLoading,
    isError,
    errorMessage,
    isFetching,
    refetch,
    handleRowClick,
    pagination,
    debugTable,
    className,
    noDataComponent,
    hidePagination,
  } = props;

  const paginationState = useMemo(
    () => ({
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
    }),
    [pagination.pageIndex, pagination.pageSize],
  );

  useImperativeHandle(
    ref,
    () => ({
      resetPagination() {
        setPagination((p) => ({ ...p, pageIndex: 0 }));
      },
    }),
    [setPagination],
  );

  const table = useReactTable({
    data: data,
    columns: columns,
    pageCount: pageCount,
    state: { pagination: paginationState },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    debugTable: debugTable,
  });

  const tableRef = useRef(table);
  tableRef.current = table;

  let content = <></>;
  if (isLoading || isFetching) {
    content = <DataTableSkeleton columns={columns.length} rows={6} />;
  } else if (!isLoading && isError) {
    content = (
      <ErrorPlaceholder
        errorMessage={errorMessage}
        retryHandler={refetch}
        isLoading={isFetching}
      />
    );
  } else if (!isLoading && !isError && data.length === 0) {
    content = noDataComponent ? (
      <>{noDataComponent}</>
    ) : (
      <NoDataPlaceholder
        retryHandler={props.refetch}
        actionHandler={props.refetch}
        isLoading={props.isFetching}
      />
    );
  } else if (!isLoading && !isError && data.length > 0) {
    content = (
      <>
        <Table className={cn('whitespace-nowrap overflow-hidden  bg-white')}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className=''>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className='text-[14px] text-[#10121299] leading-5 tracking-[-0.15px] border-b border-b-[#F5F5F5] py-2 px-4'
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className={cn(handleRowClick ? 'cursor-pointer' : '')}
                onClick={() =>
                  handleRowClick ? handleRowClick(row.original) : undefined
                }
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className='font-medium text-[14px] text-[#231F20] leading-6 tracking-[-0.24px] py-[14px] px-4 border-b border-b-[#F5F5F5] '
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </>
    );
  }

  return (
    <div
      className={cn(
        'w-full flex flex-col justify-start items-start gap-6 overflow-x-auto bg-white',
        className,
      )}
    >
      {content}

      {!hidePagination && (
        <Paginator
          page={pagination.pageIndex}
          pageSize={pagination.pageSize}
          totalPages={props.pageCount}
          totalItems={props.totalItems}
          setPage={table.setPageIndex}
          canNext={table.getCanNextPage()}
          canPrev={table.getCanPreviousPage()}
          hidePageNumbers
        />
      )}
    </div>
  );
}

export const DataTable = forwardRef(InternalDataTable) as <T>(
  props: Props<T> & { ref?: Ref<DataTableRef> },
) => ReactNode;

type DataTableDropdownActionProps = {
  actions: { label: string; selectHandler(): void; isHidden?: boolean }[];
};

export function DataTableDropdownAction({
  actions,
}: DataTableDropdownActionProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size='icon' variant='ghost' className='bg-transparent'>
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='bg-white p-1 text-14px mb-2'>
        {actions.map((ac, i) =>
          ac.isHidden ? null : (
            <DropdownMenuItem
              key={i}
              onSelect={ac.selectHandler}
              className='text-sm leading-[100%] tracking-[-0.3px] font-medium hover:bg-brand-background  text-grey-800 hover:text-brand-primary cursor-pointer'
            >
              {ac.label}
            </DropdownMenuItem>
          ),
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
