'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

import useDisclosure from '@/hooks/useDisclosure';

import Button from '@/components/buttons/Button';
import { InputSearch } from '@/components/input';
import { DataTable } from '@/components/ui';

import { useDeleteArticleMutation, useGetArticlesQuery } from '@/api/articles';
import { handleErrors } from '@/utils/error';

import DeleteArticleModal from './_components/DeleteArticleModal';
import { articlesColumns } from './_utils/articlesColumns';

// Adjust API path as needed

export default function Page() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });
  const searchParams = useSearchParams();
  // const search = searchParams.get('search');
  const page = Number(searchParams.get('page') || 1);
  const limit = 12;
  const deleteModal = useDisclosure();

  const [deleteArticle, { isLoading: isDeleting }] = useDeleteArticleMutation();
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(
    null
  );

  const {
    data: res,
    isLoading,
    isFetching,
    refetch,
  } = useGetArticlesQuery({ page, limit });
  // const articles = res?.data || [];

  function onDelete(id: string) {
    setSelectedArticleId(id);
    deleteModal.open();
  }

  function closeDeleteModal() {
    setSelectedArticleId(null);
    deleteModal.close();
  }

  async function handleConfirmDelete(id: string) {
    try {
      await deleteArticle({ articleId: id }).unwrap();
      toast.success('Article deleted');
    } catch (e) {
      handleErrors(e);
    } finally {
      closeDeleteModal();
    }
  }

  return (
    <section className='h-full overflow-y-auto px-[5%] lg:px-10 xl:px-20'>
      <h1 className='text-3xl font-serif tracking-tight font-bold text-gray-900 mb-6 mt-4 lg:mt-0'>
        Articles
      </h1>

      <div className='lg:col-span-2 flex flex-col gap-6 w-full bg-white p-6 rounded-xl shadow-sm border'>
        <div className='mb-4 flex items-center justify-between'>
          <div>
            <p className='font-medium'>Article Management</p>
            <p className='text-xs text-gray-500'>
              Create and manage blog articles
            </p>
          </div>
          <Link href='/articles/new'>
            <Button className='!py-0 h-8 text-sm !px-3'>+ New Article</Button>
          </Link>
        </div>

        <div className='mt-3 mb-2 flex flex-col md:flex-row gap-1 md:gap-4'>
          <InputSearch
            inputClassName='py-1'
            placeholder='Search for article title or author'
          />
        </div>

        {/* <CardPaginationContainer totalPages={res?.meta.totalPages}>
          {!isLoading && articles.length > 0 && (
            <div className='grid grid-cols-3 gap-6'>
              {articles.map((article) => (
                <ArticleCard
                  key={article._id}
                  id={article._id}
                  title={article.title}
                  dateCreated={article.createdAt}
                />
              ))}
            </div>
          )}
        </CardPaginationContainer> */}

        <DataTable
          data={res?.data || []}
          columns={articlesColumns(onDelete)}
          pagination={pagination}
          setPagination={setPagination}
          pageCount={res?.meta.totalPages || 1}
          totalItems={1}
          isLoading={isLoading}
          // isError={isError}
          isFetching={isFetching}
          refetch={refetch}
        />
      </div>

      <DeleteArticleModal
        isOpen={deleteModal.isOpen}
        handleCloseModal={deleteModal.close}
        handleOpenModal={deleteModal.open}
        articleId={selectedArticleId}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </section>
  );
}
