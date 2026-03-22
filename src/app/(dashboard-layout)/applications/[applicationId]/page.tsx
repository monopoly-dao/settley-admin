'use client';

import { Button } from '@mui/material';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';
import toast from 'react-hot-toast';
import {
  FaArrowLeft,
  FaEye,
  FaFile,
  FaFileAlt,
  FaFileImage,
  FaFilePdf,
  FaHistory,
  FaHome,
  FaUser,
} from 'react-icons/fa';

import {
  useAdminGetApplicationQuery,
  useAdminReviewDocumentMutation,
} from '@/api/applications';
import {
  AdminApplicationDetail,
  ApplicationStatus,
  Document,
  isValidApplicationStatus,
} from '@/api/applications/applicationsApiTypes';

import InternalNotes from '../../_components/InternalNotes';
import OfferManagement from '../../_components/OfferManagement';
import StatusBadge from '../../_components/StatusBadge';
import StatusTimeline from '../../_components/StatusTimeline';

export default function ApplicationDetailPage() {
  const { applicationId } = useParams<{ applicationId: string }>();

  const {
    data: applicationData,
    isLoading,
    error,
  } = useAdminGetApplicationQuery({ applicationId });
  const application: AdminApplicationDetail | undefined = applicationData?.data;
  const [adminReviewDocument, { isLoading: isReviewingDocument }] =
    useAdminReviewDocumentMutation();

  if (isLoading) {
    return (
      <div className='p-8'>
        <div className='flex justify-center items-center min-h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-navy'></div>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className='p-8'>
        <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
          <p className='text-red-800'>
            {error instanceof Error ? error.message : 'Application not found'}
          </p>
        </div>
      </div>
    );
  }

  // Validate and get the current status with a fallback
  const currentStatus: ApplicationStatus = isValidApplicationStatus(
    application.status
  )
    ? application.status
    : 'submitted'; // fallback to submitted if invalid

  // Create offer data if available
  const offerData =
    application.valuation && application.fees && application.timeline
      ? {
          valuation: application.valuation,
          fees: application.fees,
          timeline: application.timeline,
        }
      : undefined;

  const handleDocumentReview = async (
    documentId: string,
    status: 'approved' | 'rejected'
  ) => {
    try {
      await adminReviewDocument({
        applicationId,
        documentId,
        reviewData: { status },
      }).unwrap();
      toast.success('Document review updated');
    } catch {
      toast.error('Failed to review document');
    }
  };

  const getFileIcon = (doc: Document) => {
    const url = (doc.url || '').toLowerCase();
    if (url.endsWith('.pdf')) {
      return <FaFilePdf className='text-red-500 text-lg flex-shrink-0' />;
    }
    if (/\.(jpg|jpeg|png|gif|webp)$/.test(url)) {
      return <FaFileImage className='text-blue-500 text-lg flex-shrink-0' />;
    }
    return <FaFile className='text-gray-500 text-lg flex-shrink-0' />;
  };

  return (
    <div className='space-y-8 pb-20 overflow-y-auto h-full'>
      {/* Header */}
      <div className='flex items-center gap-4'>
        <Link
          href='/applications'
          className='p-2 bg-white border border-navy/10 rounded-lg text-navy hover:bg-navy hover:text-white transition-all shadow-sm'
        >
          <FaArrowLeft />
        </Link>
        <div>
          <div className='flex items-center gap-3 mb-1'>
            <h1 className='text-3xl font-playfair font-bold text-navy'>
              {application.propertyBasics.address}
            </h1>
            <StatusBadge status={currentStatus} />
          </div>
          <p className='text-settley-text text-sm flex items-center gap-2'>
            Application ID:{' '}
            <span className='font-bold text-navy'>{applicationId}</span> •
            Submitted on{' '}
            {new Date(application.submittedAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Left/Main Column */}
        <div className='lg:col-span-2 space-y-8'>
          {/* Property & Owner Insights */}
          <div className='bg-white p-8 rounded-2xl border border-navy/5 shadow-sm'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
              <div className='space-y-6'>
                <h3 className='text-lg font-bold text-navy flex items-center gap-2 uppercase tracking-wider'>
                  <FaHome className='text-settley-primary' /> Property
                  Information
                </h3>
                <div className='grid grid-cols-2 gap-y-4 text-sm'>
                  <span className='text-medium-grey'>Type:</span>{' '}
                  <span className='text-navy font-semibold capitalize'>
                    {application.propertyBasics.propertyType.replace('-', ' ')}
                  </span>
                  <span className='text-medium-grey'>Year Built:</span>{' '}
                  <span className='text-navy font-semibold'>
                    {application.propertyBasics.yearBuilt}
                  </span>
                  <span className='text-medium-grey'>Beds / Baths:</span>{' '}
                  <span className='text-navy font-semibold'>
                    {application.propertyBasics.bedrooms} /{' '}
                    {application.propertyBasics.bathrooms}
                  </span>
                  <span className='text-medium-grey'>Square Footage:</span>{' '}
                  <span className='text-navy font-semibold'>
                    {application.propertyBasics.squareFootage.toLocaleString()}{' '}
                    sqft
                  </span>
                  <span className='text-medium-grey'>Lot Size:</span>{' '}
                  <span className='text-navy font-semibold'>
                    {application.propertyBasics.lotSize.toLocaleString()} sqft
                  </span>
                  <span className='text-medium-grey'>Occupancy:</span>{' '}
                  <span className='text-navy font-semibold capitalize'>
                    {application.ownership.tenancyType.replace('-', ' ')}
                  </span>
                </div>
              </div>

              <div className='space-y-6'>
                <h3 className='text-lg font-bold text-navy flex items-center gap-2 uppercase tracking-wider'>
                  <FaUser className='text-settley-primary' /> Owner Information
                </h3>
                <div className='grid grid-cols-2 gap-y-4 text-sm'>
                  <span className='text-medium-grey'>Primary Owner:</span>{' '}
                  <span className='text-navy font-semibold'>
                    {application.ownerName || 'N/A'}
                  </span>
                  <span className='text-medium-grey'>Email:</span>{' '}
                  <span className='text-navy font-semibold'>
                    {application.ownerEmail || application.contact.email}
                  </span>
                  <span className='text-medium-grey'>Phone:</span>{' '}
                  <span className='text-navy font-semibold'>
                    {application.contact.phone}
                  </span>
                  <span className='text-medium-grey'>Preferred Contact:</span>{' '}
                  <span className='text-navy font-semibold capitalize'>
                    {application.contact.preferredContact}
                  </span>
                </div>
              </div>
            </div>

            <div className='mt-10 pt-8 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-12'>
              <div className='space-y-6'>
                <h3 className='text-lg font-bold text-navy uppercase tracking-wider'>
                  Financial Snapshot
                </h3>
                <div className='grid grid-cols-2 gap-y-4 text-sm'>
                  <span className='text-medium-grey'>Estimated Value:</span>{' '}
                  <span className='text-navy font-bold text-lg'>
                    ${application.financials.estimatedValue.toLocaleString()}
                  </span>
                  <span className='text-medium-grey'>Mortgage Balance:</span>{' '}
                  <span className='text-navy font-semibold'>
                    ${application.financials.mortgageBalance.toLocaleString()}
                  </span>
                  <span className='text-medium-grey'>Monthly Payment:</span>{' '}
                  <span className='text-navy font-semibold'>
                    ${application.financials.monthlyPayment.toLocaleString()}
                  </span>
                  <span className='text-medium-grey'>Outstanding Loans:</span>{' '}
                  <span className='text-navy font-semibold'>
                    ${application.financials.outstandingLoans.toLocaleString()}
                  </span>
                  <span className='text-medium-grey'>
                    Annual Property Taxes:
                  </span>{' '}
                  <span className='text-navy font-semibold'>
                    $
                    {application.financials.annualPropertyTaxes.toLocaleString()}
                  </span>
                  <span className='text-medium-grey'>Annual Insurance:</span>{' '}
                  <span className='text-navy font-semibold'>
                    ${application.financials.annualInsurance.toLocaleString()}
                  </span>
                  {application.financials.monthlyRent > 0 && (
                    <>
                      <span className='text-medium-grey'>Monthly Rent:</span>{' '}
                      <span className='text-navy font-semibold'>
                        ${application.financials.monthlyRent.toLocaleString()}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Application Journey Timeline */}
          <div className='bg-white p-8 rounded-2xl border border-navy/5 shadow-sm'>
            <h3 className='text-xl font-playfair font-bold text-navy mb-6'>
              Application Journey
            </h3>
            <StatusTimeline currentStatus={currentStatus} />
            <div className='mt-8 p-4 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100'>
              <div>
                <p className='text-[10px] uppercase font-bold text-medium-grey'>
                  Current Status
                </p>
                <p className='text-navy font-bold flex items-center gap-2 capitalize'>
                  {application.status.replace('-', ' ')}
                </p>
              </div>
              <div className='text-right'>
                <p className='text-[10px] uppercase font-bold text-medium-grey'>
                  Submitted
                </p>
                <p className='text-navy font-bold'>
                  {new Date(application.submittedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Offer Management */}
          <OfferManagement
            applicationId={applicationId}
            currentStatus={currentStatus}
            initialOffer={offerData}
          />

          {/* Internal History */}
          <div className='bg-white p-8 rounded-2xl border border-navy/5 shadow-sm'>
            <h3 className='text-lg font-bold text-navy flex items-center gap-2 uppercase tracking-wider mb-6'>
              <FaHistory className='text-settley-primary' /> Activity Log
            </h3>
            <div className='space-y-4'>
              <div className='flex gap-4 items-start pl-2 py-2 border-l-2 border-slate-100'>
                <div className='w-2 h-2 rounded-full bg-indigo-500 mt-2 -ml-[9px]' />
                <div className='text-xs'>
                  <p className='font-bold text-navy'>Application submitted</p>
                  <p className='text-medium-grey'>
                    {new Date(application.submittedAt).toLocaleDateString()} •{' '}
                    {new Date(application.submittedAt).toLocaleTimeString()} by
                    Owner
                  </p>
                </div>
              </div>
              {application.updatedAt &&
                application.updatedAt !== application.submittedAt && (
                  <div className='flex gap-4 items-start pl-2 py-2 border-l-2 border-slate-100'>
                    <div className='w-2 h-2 rounded-full bg-amber-500 mt-2 -ml-[9px]' />
                    <div className='text-xs'>
                      <p className='font-bold text-navy'>
                        Status updated to {application.status.replace('-', ' ')}
                      </p>
                      <p className='text-medium-grey'>
                        {new Date(application.updatedAt).toLocaleDateString()} •{' '}
                        {new Date(application.updatedAt).toLocaleTimeString()}{' '}
                        by System
                      </p>
                    </div>
                  </div>
                )}
              {application.notes && (
                <div className='flex gap-4 items-start pl-2 py-2 border-l-2 border-slate-100'>
                  <div className='w-2 h-2 rounded-full bg-blue-500 mt-2 -ml-[9px]' />
                  <div className='text-xs'>
                    <p className='font-bold text-navy'>Note added</p>
                    <p className='text-medium-grey'>{application.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right/Sidebar Column */}
        <div className='space-y-8'>
          {/* Documents Checklist */}
          <div className='bg-white p-8 rounded-2xl border border-navy/5 shadow-sm'>
            <h3 className='text-lg font-bold text-navy flex items-center gap-2 uppercase tracking-wider mb-6'>
              <FaFileAlt className='text-settley-primary' /> Documents
            </h3>
            <div className='space-y-3'>
              {application.documents.map((doc, idx) => (
                <div key={idx} className='space-y-2'>
                  <div className='flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100'>
                    {getFileIcon(doc)}
                    <a
                      href={doc.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex-1 text-sm font-medium text-navy hover:text-settley-primary flex items-center gap-2 truncate'
                      title={doc.name}
                    >
                      {doc.name}
                      <FaEye className='text-xs flex-shrink-0' />
                    </a>
                    <span
                      className={`font-bold text-[10px] uppercase ${
                        doc.status === 'approved'
                          ? 'text-emerald-600'
                          : doc.status === 'rejected'
                          ? 'text-red-600'
                          : doc.status === 'submitted'
                          ? 'text-blue-600'
                          : 'text-amber-600'
                      }`}
                    >
                      {doc.status}
                    </span>
                  </div>
                  {doc.status === 'submitted' && (
                    <div className='flex gap-2'>
                      <Button
                        className='flex-1 py-2 rounded-lg text-sm bg-white text-navy border border-navy hover:bg-navy/5 disabled:opacity-50 disabled:cursor-not-allowed'
                        onClick={() =>
                          void handleDocumentReview(
                            doc._id ?? doc.type,
                            'approved'
                          )
                        }
                        disabled={isReviewingDocument}
                      >
                        Approve
                      </Button>
                      <Button
                        className='flex-1 py-2 rounded-lg text-sm bg-white text-navy border border-navy hover:bg-navy/5 disabled:opacity-50 disabled:cursor-not-allowed'
                        onClick={() =>
                          void handleDocumentReview(
                            doc._id ?? doc.type,
                            'rejected'
                          )
                        }
                        disabled={isReviewingDocument}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Internal Notes */}
          <InternalNotes />
        </div>
      </div>
    </div>
  );
}
