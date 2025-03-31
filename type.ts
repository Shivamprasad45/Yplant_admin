import { ObjectId } from "mongodb";
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
  Free?: boolean;
}

export interface IUser {
  _id: ObjectId; // ObjectId from MongoDB
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role?: string;
  image?: string;
  authProviderId?: string;
}

export interface Plant_coords {
  verifed: boolean;
  _id: ObjectId; // ObjectId from MongoDB
  find_id: string;
  UserId: string;
  Plant_id: string;
  commonName: string;
  description: string;
  long: number;
  late: number;
  imageURL: string;
  Plant_Addresses: string;
  subscription: any;
  lastWeatherState: any[];
  bio?: string;
  name?: string;
  relation?: string; // Array of weather states
}
