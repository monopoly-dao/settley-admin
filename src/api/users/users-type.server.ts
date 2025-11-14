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
  ownership: {
    _id: string;
    userFirebaseId: string;
    holdings: {
      property: string;
      units: string;
      _id: string;
    }[];
    __v: 7;
    listedPositions: {
      property: string;
      pricePerUnit: string;
      units: string;
      _id: string;
    }[];
    boughtPositions: {
      property: string;
      pricePerUnit: string;
      units: string;
      _id: string;
    }[];
  };
};
