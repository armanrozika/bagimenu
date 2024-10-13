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
};
