import { Property } from '../properties/propertiesApiTypes';

export type UserResponse = {
  _id: string;
  userFirebaseId: string;
  firstName: string;
  lastName: string;
  userDetails: {
    _id: string;
    phone: string;
    twitter: string;
    username: string;
    status: string;
    walletAddress: string;
  };
  role: string;
  holdings: {
    property: Property;
    units: string;
    _id: string;
  }[];
  listings: {
    property: Property;
    pricePerUnit: string;
    units: string;
    _id: string;
  }[];
  boughtListings: {
    property: Property;
    pricePerUnit: string;
    units: string;
    _id: string;
  }[];
  transactions: {
    amount: { $numberDecimal: string };
    created_at: string;
    property: Property;
    txHash: string;
    type: 'bought';
    userFirebaseId: string;
    _id: string;
  }[];
};

export type DashboardStatsResponse = {
  totalProperties: number;
  totalUsers: number;
  totalInvestmentInDollars: number;
  totalActiveUsersWithInvestments: number;
};
