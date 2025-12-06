'use client';

import { ArrowLeft } from 'lucide-react';
import {
  Building,
  Calendar,
  Copy,
  DollarSign,
  MapPin,
  Phone,
  Shield,
  TrendingUp,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { FaUmbrellaBeach } from 'react-icons/fa6';
import { MdPool } from 'react-icons/md';

import { cn } from '@/lib/utils';

import LoadingText from '@/components/LoadingText';
import Skeleton from '@/components/Skeleton';
import Tooltip from '@/components/Tooltip';
import { DataTable, ErrorPlaceholder } from '@/components/ui';

import { useGetPropertyQuery } from '@/api/properties';
import ListingImage from '@/app/(grouped-layout)/listing/_components/ListingImage';
import { handleErrors } from '@/utils/error';
import { formatAmount } from '@/utils/utils';

import {
  propertyDocumentsColumns,
  propertyOwnersColumns,
} from '../_utils/propertiesColumns';
import { StatCard } from '../../dashboard/page';

export default function Page() {
  const { propertyId } = useParams();
  const router = useRouter();
  const [view, setView] = useState('Overview');

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });
  const {
    data: res,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useGetPropertyQuery(propertyId as string);
  const property = res?.data;
  const owners = property?.propertyDetails.owners || [];

  const views = ['Overview', 'Ownership', 'Documents'];

  const STATS_DATA = [
    {
      title: 'Total Value',
      value: formatAmount(property?.propertyDetails.units, '$') || '',
      subtext: '$1 per token',
      icon: DollarSign,
      color: 'bg-blue-500',
    },
    {
      title: 'Funding Status',
      value: property
        ? `${
            ((Number(property.propertyDetails.units) -
              Number(property.propertyDetails.unitsLeft)) /
              Number(property.propertyDetails.units)) *
            100
          }%`
        : '',
      subtext: '',
      icon: Building,
      color: 'bg-green-500',
    },
    {
      title: 'Token Holders',
      value: owners.length.toString(),
      subtext: '',
      icon: Users,
      color: 'bg-yellow-500',
    },
    {
      title: 'SPV Status',
      value: 'Active',
      subtext: property?.propertyDetails.name || '',
      icon: TrendingUp,
      color: 'bg-red-500',
    },
  ];

  const documentsData = [
    {
      name: `${property?.propertyDetails.name} Deed`,
      type: 'Deed',
      url: `/deed/${property?._id}`,
    },
  ];

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(property?.contractAddress || '');
      toast.success('Address succesfully copied!');
    } catch (e) {
      handleErrors(e);
    }
  }

  //   const session = useSession();
  //   const userFirebaseId = session.data?.userFirebaseId ?? '';
  //   const { isOpen: isBuyOpen, open: openBuy, close: closeBuy } = useDisclosure();
  if (isError)
    return (
      <ErrorPlaceholder
        errorMessage='Error Fetching Property'
        retryHandler={refetch}
        isLoading={isFetching}
      />
    );

  if (property)
    return (
      <div className='h-full overflow-y-auto'>
        <div className='mt-8 sm:mb-32 px-[5%] sm:px-[7%] flex flex-col gap-4'>
          {/* <Link href='/properties' className='text-sm font-n-montreal'>
            Back to search results
          </Link> */}

          <div className='flex items-center gap-4'>
            <button
              onClick={() => router.back()}
              className='w-8 h-8 rounded-[6px] border flex items-center justify-center'
            >
              <ArrowLeft className='w-4 h-4' />
            </button>
            <div>
              <h1 className='font-bold text-2xl font-serif tracking-tight'>
                <LoadingText
                  isLoading={isLoading}
                  value={property?.propertyDetails.name}
                />
              </h1>
              <div className='flex items-center gap-2 text-sm mt-1 text-gray-500'>
                <MapPin className='h-4 w-4' />
                <span> {property?.propertyDetails.streetAddress}</span>
              </div>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10'>
            {isLoading &&
              Array(4)
                .fill('')
                .map((_, idx) => (
                  <Skeleton key={idx} className='h-[141px] w-full' />
                ))}

            {!isLoading &&
              STATS_DATA.map((stat, index) => (
                <StatCard key={index} {...stat} />
              ))}
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
            <div className='grid gap-6 md:grid-cols-2'>
              <div className='shadow-sm p-6 border flex flex-col gap-6 rounded-xl'>
                <div className='flex flex-col gap-2'>
                  <p>Property Details</p>
                  <p className='text-sm text-gray-500'>
                    Operational and physical details of the asset
                  </p>
                </div>

                <div className='space-y-4'>
                  <div className='grid grid-cols-2 gap-4 text-sm'>
                    <div className='space-y-1'>
                      <p className='text-gray-500 text-sm font-medium'>
                        Acquisition Date
                      </p>
                      <div className='flex items-center gap-2'>
                        <Calendar className='text-gray-500 h-4 w-4' />
                        <p>11/15/2023</p>
                      </div>
                    </div>

                    <div className='space-y-1'>
                      <p className='text-gray-500 text-sm font-medium'>
                        Operational Contact
                      </p>
                      <div className='flex items-center gap-2'>
                        <Phone className='text-gray-500 h-4 w-4' />
                        <p>+43 1 234 5678</p>
                      </div>
                    </div>

                    <div className='space-y-1 col-span-2'>
                      <p className='text-gray-500 text-sm font-medium'>
                        Description
                      </p>
                      <p className='text-gray-500 text-sm'>
                        {property?.propertyDetails.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className='shadow-sm p-6 border flex flex-col gap-6 rounded-xl'>
                <div className='flex flex-col gap-2'>
                  <p>SPV & Custody</p>
                  <p className='text-sm text-gray-500'>
                    Legal structure and deed custody information
                  </p>
                </div>

                <div className='space-y-1'>
                  <p className='text-gray-500 text-sm font-medium'>SPV Name</p>
                  <div className='flex items-center gap-2'>
                    <p>{property?.propertyDetails?.name}</p>
                  </div>
                </div>

                <div className='space-y-1'>
                  <p className='text-gray-500 text-sm font-medium'>
                    Deed Custody
                  </p>
                  <div className='flex items-center gap-2'>
                    <Shield className='text-gray-500 h-4 w-4' />
                    <p>Vienna Notary Services GmbH</p>
                  </div>
                </div>

                <div className='space-y-4'>
                  <div>
                    <p className='text-sm text-gray-500 mb-1'>
                      Contract Address
                    </p>
                    <div className='flex items-center justify-between rounded-md bg-gray-200 font-mono border p-2'>
                      {truncateAddress(property?.contractAddress || '')}
                      <button onClick={copyAddress}>
                        <Copy className='w-4 h-4' />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {view === 'Ownership' && (
            <>
              <div className='lg:col-span-2 flex flex-col gap-6 w-full bg-white p-6 rounded-xl shadow-sm border'>
                <div className='mb-4'>
                  <p className='font-medium'>Token Holders</p>
                  <p className='text-xs text-gray-500'>
                    Current owners of {property?.propertyDetails?.name} tokens.
                  </p>
                </div>

                <DataTable
                  data={owners}
                  columns={propertyOwnersColumns}
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

          {view === 'Documents' && (
            <>
              <div className='lg:col-span-2 flex flex-col gap-6 w-full bg-white p-6 rounded-xl shadow-sm border'>
                <div className='mb-4'>
                  <p className='font-medium'>Property Documents</p>
                  <p className='text-xs text-gray-500'>
                    Legal and operational documents for this asset.
                  </p>
                </div>

                <DataTable
                  data={documentsData}
                  columns={propertyDocumentsColumns}
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

          {/* <Image
            src={property?.propertyDetails.photos[0].url}
            alt={property?.propertyDetails.name ?? ''}
            width={450}
            height={300}
          /> */}
          <div className='grid mt-8 grid-cols-3 grid-rows-3 gap-4 h-[500px] sm:h-[800px]'>
            <div className='col-span-3 row-span-2'>
              <ListingImage
                src={property?.propertyDetails.photos[0].url}
                alt={property?.propertyDetails.name ?? ''}
              />
            </div>
            {property?.propertyDetails.photos.slice(1).map((photo) => (
              <div className='col-span-1 row-span-1' key={photo.url}>
                <ListingImage src={photo.url} alt='photo.url' />
              </div>
            ))}
            {/* <div className='col-span-1 row-span-1'>
              <ListingImage
                src={property?.propertyDetails.photos[2].url}
                alt={property?.propertyDetails.name ?? ''}
              />
            </div>
            <div className='col-span-1 row-span-1'>
              <ListingImage
                src={property?.propertyDetails.photos[3].url}
                alt={property?.propertyDetails.name ?? ''}
              />
            </div> */}
          </div>

          <div className='mt-12 mb-16 flex flex-col-reverse sm:flex-row w-full justify-between gap-5'>
            <div className='w-full sm:w-3/5 flex flex-col gap-7'>
              <div>
                <p className='text-3xl font-medium'>
                  <LoadingText
                    isLoading={isLoading}
                    value={property?.propertyDetails.name}
                  />
                </p>
                <div className='flex items-center gap-4 mt-2 text-navy'>
                  <div className='flex items-center gap-1'>
                    <p>
                      <LoadingText
                        isLoading={isLoading}
                        className='w-10'
                        value={property?.propertyDetails.bed}
                      />{' '}
                      Beds
                    </p>
                  </div>
                  <div className='flex items-center gap-1'>
                    <p>
                      <LoadingText
                        isLoading={isLoading}
                        className='w-10'
                        value={property?.propertyDetails.bath}
                      />{' '}
                      Baths
                    </p>
                  </div>
                  <div className='flex items-center gap-1'>
                    <p>
                      <LoadingText
                        isLoading={isLoading}
                        className='w-10'
                        value={formatAmount(property?.propertyDetails.squareFt)}
                      />{' '}
                      sqft
                    </p>
                  </div>
                </div>
                <p className='mt-7 w-4/5'>
                  <LoadingText
                    isLoading={isLoading}
                    className='w-full h-[80px]'
                    value={property?.propertyDetails.description}
                  />
                </p>
              </div>
              <div className='h-[1px] w-full bg-medium-grey' />
              <div className='flex flex-col gap-4'>
                <p className='font-medium text-xl'>Asset Symbol</p>
                <p className='font-medium text-[green]/60'>
                  $
                  <LoadingText
                    isLoading={isLoading}
                    className='w-10'
                    value={property?.propertyDetails.symbol}
                  />
                </p>
              </div>
              <div className='h-[1px] w-full bg-medium-grey' />
              <div className='flex flex-col gap-4'>
                <p className='font-medium text-xl flex items-center gap-2'>
                  Property Title Deed
                  <Tooltip caption='Click on View Title Deed to generate and download the deed document for this property.' />
                </p>
                <Link
                  className='underline w-fit'
                  href={`/deed/${property?._id}`}
                  target='_blank'
                >
                  View Title Deed
                </Link>
              </div>
              <div className='h-[1px] w-full bg-medium-grey' />
              <div className='flex flex-col gap-4'>
                <p className='font-medium text-xl flex items-center gap-2'>
                  Contract Address
                  <Tooltip caption='You can follow the link to view this property on the basescan blockchain explorer.' />
                </p>
                <Link
                  href={`https://basescan.org/address/${property?.contractAddress}`}
                  target='_blank'
                  className='text-[blue] underline break-words'
                >
                  <LoadingText
                    isLoading={isLoading}
                    className='w-10'
                    value={property?.contractAddress}
                  />
                </Link>
              </div>
              <div className='h-[1px] w-full bg-medium-grey' />
              <div className='flex flex-col gap-4'>
                <p className='font-medium text-xl'>Features</p>
                <div className='flex items-center gap-10 mt-2 text-lg text-navy'>
                  <div className='flex items-center gap-1'>
                    <MdPool />
                    <p>Pool</p>
                  </div>
                  <div className='flex items-center gap-1'>
                    <MdPool />
                    <p>Ocean view</p>
                  </div>
                  <div className='flex items-center gap-1'>
                    <FaUmbrellaBeach />
                    <p>Deck</p>
                  </div>
                </div>
              </div>
            </div>
            <div className='flex flex-col gap-2 w-full sm:w-2/5 lg:w-1/4'>
              <p className='text-3xl '>$1</p>
              <div className=' text-sm'>
                {formatAmount(property?.propertyDetails.unitsLeft)} Units left.{' '}
                <LoadingText
                  isLoading={isLoading}
                  className='w-10'
                  value={property?.propertyDetails.owners.length}
                />{' '}
                owners
              </div>
              {/* <div className='flex items-center gap-4'>
              <Button
                variant='outline'
                leftIcon={FaRegBookmark}
                className='py-2 px-5 bg-transparent text-navy border-navy'
              >
                Share
              </Button>
              <Button
                variant='outline'
                leftIcon={CiShare2}
                className='py-2 px-5 bg-transparent text-navy border-navy'
              >
                Share
              </Button>
            </div> */}
              {/* <Button
              variant='ghost'
              onClick={() => {
                authenticatedFuncWrapper(openBuy, session.status);
              }}
              className='max-w-[258px] py-4 w-full bg-navy text-white border-navy'
            >
              Buy Property
            </Button> */}
            </div>
          </div>

          {/* <YouMightAlsoLike /> */}
        </div>
      </div>
    );
}
