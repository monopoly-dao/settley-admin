export enum PropertiesEndpoints {
  Get_Properties = '/admin/properties',
  Get_Property = '/admin/properties/MDAO-:propertyId',
  Get_Wishlist = '/wishlist/:userFirebaseId',
  Add_Property_To_Wishlist = '/wishlist/add/:propertyId',
  Remove_Property_From_Wishlist = '/wishlist/remove/:propertyId',
}
