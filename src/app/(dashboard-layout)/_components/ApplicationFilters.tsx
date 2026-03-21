'use client';

import React, { useState } from 'react';
import InputSearch from '@/components/input/input-search';
import Select from '@/components/input/select';

const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'submitted', label: 'Submitted' },
    { value: 'under-review', label: 'Under Review' },
    { value: 'offer-sent', label: 'Offer Sent' },
    { value: 'due-diligence', label: 'Due Diligence' },
    { value: 'listed', label: 'Listed' },
    { value: 'closed', label: 'Closed' },
    { value: 'rejected', label: 'Rejected' },
];

interface ApplicationFiltersProps {
    filters: {
        status?: string;
        location?: string;
        minValue?: number;
        maxValue?: number;
        page?: number;
        limit?: number;
        daysPending?: number;
    };
    onFilterChange: (newFilters: Partial<typeof filters>) => void;
}

export default function ApplicationFilters({ filters, onFilterChange }: ApplicationFiltersProps) {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
            <div className="w-full md:w-1/3">
                <InputSearch
                    placeholder="Search by address or owner..."
                    className="bg-white border-navy/10 h-10"
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        // You can also call onFilterChange({ location: e.target.value }) if you want to filter by location
                    }}
                />
            </div>

            <div className="flex gap-4 w-full md:w-auto">
                <div className="w-48">
                    <Select
                        value={filters.status || ''}
                        setValue={(val) => onFilterChange({ status: val || undefined })}
                        options={statusOptions}
                        placeholder="All Statuses"
                        variant="light"
                        controlClassName="h-10 py-0"
                    />
                </div>
                {/* Location filter placeholder - can be implemented */}
                <div className="w-48">
                    <Select
                        value=""
                        setValue={() => {}}
                        options={[{ value: '', label: 'All Locations' }]}
                        placeholder="All Locations"
                        variant="light"
                        controlClassName="h-10 py-0"
                    />
                </div>
            </div>
        </div>
    );
}
