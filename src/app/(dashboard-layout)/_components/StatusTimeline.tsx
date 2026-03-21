'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { FaCheckCircle } from 'react-icons/fa';
import { ApplicationStatus } from '@/api/applications/applicationsApiTypes';

interface StatusTimelineProps {
    currentStatus: ApplicationStatus;
}

const statusSteps: { id: ApplicationStatus; label: string }[] = [
    { id: 'submitted', label: 'Submitted' },
    { id: 'under-review', label: 'Under Review' },
    { id: 'offer-sent', label: 'Offer Sent' },
    { id: 'due-diligence', label: 'Due Diligence' },
    { id: 'listed', label: 'Listed' },
    { id: 'closed', label: 'Closed' },
    { id: 'rejected', label: 'Rejected' },
];

export default function StatusTimeline({ currentStatus }: StatusTimelineProps) {
    const currentIndex = statusSteps.findIndex((step) => step.id === currentStatus);

    return (
        <div className="w-full py-8">
            <div className="relative flex justify-between">
                {/* Background Line */}
                <div className="absolute top-5 left-0 w-full h-0.5 bg-medium-grey -z-10" />

                {/* Progress Line */}
                <div
                    className="absolute top-5 left-0 h-0.5 bg-settley-primary -z-10 transition-all duration-500"
                    style={{ width: `${(currentIndex / (statusSteps.length - 1)) * 100}%` }}
                />

                {statusSteps.map((step, index) => {
                    const isCompleted = index < currentIndex;
                    const isCurrent = index === currentIndex;

                    return (
                        <div key={step.id} className="flex flex-col items-center flex-1">
                            <div
                                className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                                    isCompleted ? "bg-settley-primary border-settley-primary text-white" :
                                        isCurrent ? "bg-white border-navy text-navy scale-110 shadow-lg" :
                                            "bg-white border-medium-grey text-medium-grey"
                                )}
                            >
                                {isCompleted ? <FaCheckCircle /> : <span>{index + 1}</span>}
                            </div>
                            <span
                                className={cn(
                                    "mt-3 text-[10px] md:text-xs font-bold uppercase tracking-tighter text-center",
                                    isCurrent ? "text-navy" : "text-medium-grey"
                                )}
                            >
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
