export interface PropertyBasics {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  lat: number;
  lon: number;
  propertyType: 'single-family' | 'condo' | 'multi-family';
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  yearBuilt: number;
  lotSize: number;
}

export interface Financials {
  estimatedValue: number;
  mortgageBalance: number;
  monthlyPayment: number;
  outstandingLoans: number;
  annualPropertyTaxes: number;
  annualInsurance: number;
  monthlyRent: number;
}

export interface Ownership {
  ownershipType: 'sole' | 'joint' | 'trust';
  ownershipPercentage: number;
  tenancyType: 'owner-occupied' | 'vacant' | 'rental';
  leaseEndDate?: string;
}

export interface Document {
  _id?: string;
  type: 'deed' | 'mortgage' | 'lease' | 'id';
  name: string;
  url: string;
  status: 'pending' | 'submitted' | 'approved' | 'rejected';
  notes?: string;
}

export interface Contact {
  phone: string;
  email: string;
  preferredContact: 'phone' | 'email';
  agreedToTerms: boolean;
}

export interface OwnerApplication {
  _id: string;
  propertyBasics: PropertyBasics;
  financials: Financials;
  ownership: Ownership;
  documents: Document[];
  contact: Contact;
  status: 'submitted' | 'under-review' | 'offer-sent' | 'due-diligence' | 'listed' | 'rejected';
  submittedAt: string;
  updatedAt: string;
  notes?: string;
  valuation?: string;
  fees?: string;
  timeline?: string;
}

export interface AdminApplicationDetail extends OwnerApplication {
  ownerName: string;
  ownerEmail: string;
}

export interface AdminApplication {
  _id: string;
  applicationId: string;
  propertyAddress: string;
  ownerName: string;
  ownerEmail: string;
  estimatedValue: string;
  status: ApplicationStatus;
  daysPending: number;
  submittedAt: string;
}

export interface AdminApplicationsResponse {
  success: boolean;
  data: AdminApplication[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  stats: {
    totalPending: number;
    averageSLA: number;
  };
}

export interface UpdateApplicationStatusRequest {
  status: 'under-review' | 'offer-sent' | 'due-diligence' | 'listed' | 'rejected';
  notes?: string;
  valuation?: string;
  fees?: string;
  timeline?: string;
}

export interface ReviewDocumentRequest {
  status: 'approved' | 'rejected';
  notes?: string;
}

export type ApplicationStatus =
  | 'submitted'
  | 'under-review'
  | 'offer-sent'
  | 'due-diligence'
  | 'listed'
  | 'closed'
  | 'rejected';

export const isValidApplicationStatus = (
  status: string
): status is ApplicationStatus => {
  const validStatuses: ApplicationStatus[] = [
    'submitted',
    'under-review',
    'offer-sent',
    'due-diligence',
    'listed',
    'closed',
    'rejected',
  ];
  return validStatuses.includes(status as ApplicationStatus);
};
