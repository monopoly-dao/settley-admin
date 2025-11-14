'use client';

import { Pagination } from 'react-headless-pagination';

import { cn } from '@/lib/utils';

import { Button } from './button';

function PaginationButton({
  label,
  isDisabled,
}: {
  label: string;
  isDisabled?: boolean;
}) {
  return (
    <Button
      asChild
      size='sm'
      variant='outline'
      className='min-w-fit !text-sm border-transparent shadow-none font-normal py-0 px-1 rounded-none'
      disabled={isDisabled}
    >
      <span>{label}</span>
    </Button>
  );
}

type PaginatorProps = {
  page: number;
  pageSize?: number;
  totalPages: number;
  totalItems: number;
  canNext?: boolean;
  canPrev?: boolean;
  hidePageNumbers?: boolean;
  edgeCount?: number;
  className?: string;
  middlePageSiblingsCount?: number;
  setPage(page: number): void;
  isDisabled?: boolean;
};

export function Paginator({
  page,
  setPage,
  totalPages,
  canNext,
  canPrev,
  className,
  edgeCount = 1,
  middlePageSiblingsCount = 1,
  isDisabled,
}: PaginatorProps) {
  return (
    <div
      className={cn(
        'w-full flex flex-wrap !justify-end',
        'items-center gap-3',
        className,
      )}
    >
      <Pagination
        currentPage={page}
        setCurrentPage={setPage}
        totalPages={totalPages}
        middlePagesSiblingCount={middlePageSiblingsCount}
        edgePageCount={edgeCount}
        truncableClassName={cn(
          'hidden lg:!flex justify-center items-center',
          'text-[#2F2B43] rounded-[10px] cursor-default size-[40px] shrink-0',
        )}
        className='w-fit flex flex-wrap justify-end items-center gap-0'
      >
        <Pagination.PrevButton
          disabled={!canPrev || isDisabled}
          className='disabled:!cursor-not-allowed'
        >
          <PaginationButton
            label='Previous'
            isDisabled={!canPrev || isDisabled}
          />
        </Pagination.PrevButton>

        <ul className='hidden lg:!flex justify-center items-center gap-0 !px-0'>
          <Pagination.PageButton
            disabled={isDisabled}
            activeClassName='font-semibold !text-[#006A5D]'
            inactiveClassName='text-[##7B7979]'
            className={cn(
              'text-[##7B7979] size-[40px] shrink-0  !p-0',
              'flex justify-center items-center cursor-pointer text-[14px] leading-5 tracking-[-0.15px]',
            )}
          />
        </ul>

        <Pagination.NextButton
          disabled={!canNext || isDisabled}
          className='disabled:!cursor-not-allowed'
        >
          <PaginationButton label='Next' isDisabled={!canNext || isDisabled} />
        </Pagination.NextButton>
      </Pagination>
    </div>
  );
}
