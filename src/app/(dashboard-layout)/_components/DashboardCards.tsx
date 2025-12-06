import { LucideIcon } from 'lucide-react';

type StatProps = {
  title: string;
  value: string;
  subtext: string;
  icon: LucideIcon;
};

export const StatCard = ({ title, value, subtext, icon: Icon }: StatProps) => (
  <div className='flex flex-col gap-6 py-6 bg-white rounded-xl shadow-sm transition-shadow duration-300 hover:shadow-lg border'>
    <div className='flex items-center justify-between px-6'>
      <p className='text-sm font-medium'>{title}</p>
      <div className=''>
        <Icon className='w-4 h-4' />
      </div>
    </div>

    <div className='px-6'>
      <p className='text-2xl font-bold'>{value}</p>
      <p className='text-xs text-gray-400'>{subtext}</p>
    </div>
  </div>
);
