'use client';

import { Building, DollarSign, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';

import Skeleton from '@/components/Skeleton';

import { useGetUserDetailsQuery } from '@/api/profile';
import { useGetPropertiesQuery } from '@/api/properties';
import {
  useGetDashboardStatsQuery,
  useGetUsersQuery,
} from '@/api/users/users-action.server';
import { formatAmount } from '@/utils/utils';

import { StatCard } from '../_components/DashboardCards';

type PropertyProps = {
  name: string;
  location: string;
  tokens: string;
  sold: string;
};

const PropertyCard = ({ name, location, tokens, sold }: PropertyProps) => (
  <div className='flex items-center justify-between'>
    <div>
      <div className='font-medium text-sm text-gray-800'>{name}</div>
      <div className='text-sm text-gray-500 mb-2'>{location}</div>
    </div>

    <div className='hidden md:flex items-center gap-4'>
      <div className='text-sm text-right'>
        <div className='font-medium'>{tokens}</div>
        <div className='text-xs'>Tokens sold</div>
      </div>
      <div className='h-2 bg-gray-200 w-[96px] rounded-full overflow-hidden'>
        <div
          className='h-full bg-navy rounded-full'
          style={{ width: sold }} // Use 'sold' percentage as width
          aria-valuenow={parseFloat(sold)}
          aria-valuemin={0}
          aria-valuemax={100}
        ></div>
      </div>

      <div className='font-medium'>{sold}</div>
    </div>
  </div>
);

type UserProps = {
  name: string;
  email: string;
  invested: string;
};

const UserCard = ({ name, email, invested }: UserProps) => (
  <div className='flex items-center justify-between'>
    <div>
      <div className='font-medium text-sm text-gray-800'>{name}</div>
      <div className='text-sm text-gray-500 mb-2'>{email}</div>
    </div>

    <div className='hidden md:flex items-center gap-4'>
      <div className='text-sm text-right'>
        <div className='font-medium'>{invested}</div>
        <div className='text-xs'>invested</div>
      </div>

      {/* <div className='font-medium'>{sold}</div> */}
    </div>
  </div>
);

export default function Page() {
  const { data: statsRes, isLoading: isStatsLoading } =
    useGetDashboardStatsQuery();
  const stats = statsRes?.data;

  const { data: propertiesRes, isLoading: isPropertiesLoading } =
    useGetPropertiesQuery({
      limit: 5,
      page: 1,
    });

  const { data: usersRes, isLoading: isUsersLoading } = useGetUsersQuery({
    limit: 5,
    page: 1,
  });

  const { data: profileRes, isLoading: isProfileLoading } =
    useGetUserDetailsQuery();

  const STATS_DATA = [
    {
      title: 'Total Properties',
      value: formatAmount(stats?.totalProperties) || '',
      subtext: 'active funding rounds',
      icon: Building,
    },
    {
      title: 'Total Users',
      value: formatAmount(stats?.totalUsers) || '',
      subtext: '',
      icon: Users,
    },
    {
      title: 'Total Investment',
      value: formatAmount(stats?.totalInvestmentInDollars, '$') || '',
      subtext: 'Across all properties',
      icon: DollarSign,
    },
    {
      title: 'Active Users',
      value: formatAmount(stats?.totalActiveUsersWithInvestments) || '',
      subtext: 'Users with investments',
      icon: TrendingUp,
    },
  ];

  const PROPERTY_DATA = propertiesRes?.data.map((property) => ({
    name: property.propertyDetails.name,
    location: `${property.propertyDetails.stateOrProvince}, ${property.propertyDetails.country}`,
    tokens: `${
      Number(property.propertyDetails.units) -
      Number(property.propertyDetails.unitsLeft)
    } / ${property.propertyDetails.units}`,
    sold: `${
      ((Number(property.propertyDetails.units) -
        Number(property.propertyDetails.unitsLeft)) /
        Number(property.propertyDetails.units)) *
      100
    }%`,
  }));

  const MOCK_USER_DATA = usersRes?.data.map((user) => ({
    id: user?.userFirebaseId || '',
    name: `${user.firstName} ${user.lastName}`,
    email: user?.userDetails?.username || '',
    invested:
      formatAmount(
        user.holdings.length > 0
          ? user.holdings?.reduce(
              (acc, holding) => acc + Number(holding.units),
              0
            )
          : 0,
        '$'
      ) || '',
    status: 'verified',
  }));

  // [

  //   {
  //     id: 2,
  //     name: 'Temisan Agbajoh',
  //     email: 'temisan@example.com',
  //     invested: 0,
  //     status: 'pending',
  //   },
  //   {
  //     id: 3,
  //     name: 'Gerrard Inn',
  //     email: 'gerrard@example.com',
  //     invested: 0,
  //     status: 'not started',
  //   },
  //   {
  //     id: 4,
  //     name: 'Patrick Bello',
  //     email: 'patrick@example.com',
  //     invested: 0,
  //     status: 'rejected',
  //   },
  //   {
  //     id: 5,
  //     name: 'Gregory Ikechukwu',
  //     email: 'gregory@example.com',
  //     invested: 4500,
  //     status: 'verified',
  //   },
  // ];

  return (
    <section className='h-full overflow-y-auto px-[5%] lg:px-10 xl:px-20'>
      <h1 className='text-3xl font-serif tracking-tight font-bold text-gray-900 mb-6 mt-4 lg:mt-0'>
        Welcome, {isProfileLoading && '...'}
        {!isProfileLoading && profileRes?.data.firstName}
      </h1>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10'>
        {isStatsLoading &&
          Array(4)
            .fill('')
            .map((_, idx) => (
              <Skeleton key={idx} className='h-[141px] w-full' />
            ))}
        {!isStatsLoading &&
          STATS_DATA.map((stat, index) => <StatCard key={index} {...stat} />)}
      </div>

      {/* Content Sections Grid (Properties & Users) */}
      <div className=''>
        {/* Properties Section (List/Card Layout) */}
        <div className='lg:col-span-2 flex flex-col gap-6 w-full bg-white p-6 rounded-xl shadow-sm border'>
          <div className='flex justify-between items-center mb-4'>
            <p className='font-semibold'>Properties</p>
            <Link
              href='/properties'
              className='text-sm font-medium transition-colors'
            >
              See all
            </Link>
          </div>

          <div className='space-y-4'>
            {isPropertiesLoading &&
              Array(4)
                .fill('')
                .map((_, idx) => (
                  <Skeleton key={idx} className='h-[141px] w-full' />
                ))}
            {!isPropertiesLoading &&
              PROPERTY_DATA?.map((property, index) => (
                <PropertyCard key={index} {...property} />
              ))}
          </div>
        </div>

        <div className='lg:col-span-2 flex flex-col gap-6 w-full bg-white p-6 rounded-xl shadow-sm border mt-10'>
          <div className='flex justify-between items-center mb-4'>
            <p className='font-semibold'>Users</p>
            <Link
              href='/users'
              className='text-sm font-medium transition-colors'
            >
              See all
            </Link>
          </div>

          <div className='space-y-4'>
            {isUsersLoading &&
              Array(4)
                .fill('')
                .map((_, idx) => (
                  <Skeleton key={idx} className='h-[141px] w-full' />
                ))}
            {!isUsersLoading &&
              MOCK_USER_DATA?.map((user, index) => (
                <UserCard key={index} {...user} />
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
