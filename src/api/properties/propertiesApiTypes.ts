import { UserResponse } from '../users/users-type.server';

export type Property = {
  _id: string;
  contractAddress: string;
  deedUrl: string;
  propertyDetails: {
    _id: string;
    name: string;
    description: string;
    photos: {
      url: string;
    }[];
    streetAddress: string;
    stateOrProvince: string;
    country: string;
    lat: string;
    lon: string;
    units: string;
    unitsLeft: string;
    symbol: string;
    bed: string;
    bath: string;
    squareFt: string;
    owners: UserResponse[];
  };
};

export type WishlistItem = Property;

export type Wishlist = {
  userFirebaseId: string;
  wishlist: WishlistItem[];
};
