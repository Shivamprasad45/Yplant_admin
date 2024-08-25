export interface TreeCart {
  UserId: string;
  Plant_id: string;
  commonName: string;
  scientificName: string;
  description: string;
  growthRequirements: string;
  benefits: string[];
  region: string;
  imageURL: string;
  price: number;
  quantity: number;
}

interface Addresses {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  phone: string;
  city: string;
  state: string;
  zipCode: string;
}
export interface Plant_order {
  Addresss: Addresses;
  Orderid: string;
  plants: TreeCart[];
  User_name: string;
}
export interface IPlantProfile {
  _id: string;
  Plaintid: string;
  findtree_id: string;
  UserId: string;
  imageUrl: string;
  name: string;
  age: number;
  status: number;
}
