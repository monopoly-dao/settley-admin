'use client';

import React, { useState } from 'react';
import Button from '@/components/buttons/Button';
import { Input } from '@/components/input';
import Select from '@/components/input/select';
import { ApplicationStatus } from '@/api/applications/applicationsApiTypes';
import toast from 'react-hot-toast';
import { useAdminUpdateApplicationStatusMutation } from '@/api/applications';

interface OfferManagementProps {
    applicationId: string;
    currentStatus: ApplicationStatus;
    initialOffer?: {
        valuation: string;
        fees: string;
        timeline: string;
    };
}

const statusOptions = [
    { value: 'under-review', label: 'Under Review' },
    { value: 'offer-sent', label: 'Offer Sent' },
    { value: 'due-diligence', label: 'Due Diligence' },
    { value: 'listed', label: 'Listed' },
    { value: 'rejected', label: 'Rejected' },
];

export default function OfferManagement({ applicationId, currentStatus, initialOffer }: OfferManagementProps) {
    type AdminReviewStatus =
        | 'under-review'
        | 'offer-sent'
        | 'due-diligence'
        | 'listed'
        | 'rejected';

    const allowedStatuses = statusOptions.map((o) => o.value) as AdminReviewStatus[];
    const initialStatus = allowedStatuses.includes(currentStatus as AdminReviewStatus)
        ? (currentStatus as AdminReviewStatus)
        : 'under-review';

    const [status, setStatus] = useState<AdminReviewStatus>(initialStatus);
    const [offer, setOffer] = useState(initialOffer || { valuation: '', fees: '', timeline: '' });
    const [updateApplicationStatus, { isLoading: isUpdating }] =
        useAdminUpdateApplicationStatusMutation();

    const handleUpdateStatus = async (overrideStatus?: AdminReviewStatus) => {
        const nextStatus = overrideStatus ?? status;
        try {
            await updateApplicationStatus({
                applicationId,
                statusData: {
                    status: nextStatus,
                    ...(offer.valuation ? { valuation: offer.valuation } : {}),
                    ...(offer.fees ? { fees: offer.fees } : {}),
                    ...(offer.timeline ? { timeline: offer.timeline } : {}),
                },
            }).unwrap();
            toast.success('Application updated');
        } catch {
            toast.error('Failed to update application status');
        }
    };

    return (
        <div className="bg-white p-8 rounded-2xl border border-navy/5 shadow-sm space-y-8">
            <div>
                <h3 className="text-xl font-playfair font-bold text-navy mb-6">Offer Management</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <p className="text-sm font-bold text-navy uppercase tracking-wider">Current Status</p>
                        <div className="w-full">
                            <Select
                                id="offer-status-select"
                                options={statusOptions}
                                value={status}
                                setValue={(val) => setStatus(val as AdminReviewStatus)}
                                variant="light"
                            />
                        </div>
                    </div>

                    <div className="flex items-end">
                        <Button
                            className="w-full py-3 rounded-xl font-bold"
                            onClick={() => void handleUpdateStatus()}
                            disabled={isUpdating}
                        >
                            Update Status
                        </Button>
                    </div>
                </div>
            </div>

            <div className="border-t border-slate-100 pt-8">
                <h4 className="text-lg font-bold text-navy mb-6">Financial Offer Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Input
                        id="offer-valuation"
                        label="Valuation Range"
                        value={offer.valuation}
                        onChange={(e) => setOffer({ ...offer, valuation: e.target.value })}
                        placeholder="e.g. $450k - $480k"
                    />
                    <Input
                        id="offer-fees"
                        label="Service Fee (%)"
                        value={offer.fees}
                        onChange={(e) => setOffer({ ...offer, fees: e.target.value })}
                        placeholder="e.g. 4.5%"
                    />
                    <Input
                        id="offer-timeline"
                        label="Est. Timeline"
                        value={offer.timeline}
                        onChange={(e) => setOffer({ ...offer, timeline: e.target.value })}
                        placeholder="e.g. 14-21 days"
                    />
                </div>

                <div className="mt-8 flex gap-4">
                    <Button
                        className="flex-1 py-3 rounded-xl font-bold bg-navy text-white"
                        onClick={() => void handleUpdateStatus()}
                        disabled={isUpdating}
                    >
                        Save Offer Details
                    </Button>
                    <Button
                        className="flex-1 py-3 rounded-xl font-bold bg-white text-navy border border-navy hover:bg-navy/5"
                        onClick={() => void handleUpdateStatus('offer-sent')}
                        disabled={isUpdating}
                    >
                        Send to Owner
                    </Button>
                </div>
            </div>
        </div>
    );
}
