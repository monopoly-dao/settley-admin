'use client';

import React from 'react';

import { cn } from '@/lib/utils';

import { ApplicationStatus } from '@/api/applications/applicationsApiTypes';

interface StatusBadgeProps {
  status: ApplicationStatus;
}

const statusConfig: Record<
  ApplicationStatus,
  { label: string; className: string }
> = {
  submitted: { label: 'Submitted', className: 'bg-blue-100 text-blue-700' },
  'under-review': {
    label: 'Under Review',
    className: 'bg-amber-100 text-amber-700',
  },
  'offer-sent': {
    label: 'Offer Sent',
    className: 'bg-indigo-100 text-indigo-700',
  },
  'due-diligence': {
    label: 'Due Diligence',
    className: 'bg-purple-100 text-purple-700',
  },
  listed: { label: 'Listed', className: 'bg-emerald-100 text-emerald-700' },
  closed: { label: 'Closed', className: 'bg-slate-100 text-slate-700' },
  rejected: { label: 'Rejected', className: 'bg-red-100 text-red-700' },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider',
        config.className
      )}
    >
      {config.label}
    </span>
  );
}
