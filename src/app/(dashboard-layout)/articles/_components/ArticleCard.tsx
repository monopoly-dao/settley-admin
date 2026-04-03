'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from 'react';

export interface ArticleCardProps {
  slug: string;
  title: string;
  dateCreated: Date | string;
  coverImage?: string;
  excerpt?: string;
  author?: string;
  tags?: string[];
  href?: string;
  children?: ReactNode;
}

export default function ArticleCard({
  slug,
  title,
  dateCreated,
  coverImage,
  excerpt,
  author,
  tags,
  href = `/articles/${slug}`,
  children,
}: ArticleCardProps) {
  const formattedDate = new Date(dateCreated).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const cardContent = (
    <div className='w-full h-[320px] rounded-lg border border-gray-300 bg-white overflow-hidden hover:shadow-lg transition-shadow duration-300'>
      {/* Background Image */}
      {coverImage && (
        <div className='relative w-full h-[60%] bg-gray-200'>
          <Image
            src={coverImage}
            alt={title}
            fill
            quality={100}
            loading='lazy'
            className='object-cover'
          />
        </div>
      )}

      {/* Content Section */}
      <div className='flex flex-col gap-2 p-4 h-[40%]'>
        {/* Title */}
        <h3 className='font-bold text-lg line-clamp-2 text-gray-900'>
          {title}
        </h3>

        {/* Excerpt */}
        {excerpt && (
          <p className='text-sm text-gray-600 line-clamp-2'>
            {excerpt}
          </p>
        )}

        {/* Author */}
        {author && (
          <p className='text-xs text-gray-500'>
            By {author}
          </p>
        )}

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className='flex flex-wrap gap-1 mt-1'>
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className='px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded'
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Date Created */}
        <time className='text-xs text-gray-500 mt-auto'>{formattedDate}</time>

        {/* Optional Children */}
        {children && <div className='text-sm text-gray-700'>{children}</div>}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className='block'>
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
