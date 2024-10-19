import { Id } from "../../convex/_generated/dataModel";

export enum RegisterType {
  Login,
  Signup,
}

export enum MutationType {
  Create,
  Patch,
}

export type SignUpType = {
  emailAddress: string;
  password: string;
};

export type SignInType = {
  identifier: string;
  password: string;
};

export type StoreCreateType = {
  name: string;
  url: string;
  whatsapp: string;
};

export type CreateProductType = {
  name: string;
  price: number;
  image_url: string;
  category_id: string;
};

export type CreateCategoryType = {
  name: string;
};

export type ProductType = {
  _id: Id<"products">;
  _creationTime: number;
  name: string;
  price: number;
  is_active: boolean;
  image_url: string;
  store_id: Id<"stores">;
  category_id: Id<"categories"> | "ALL";
};
