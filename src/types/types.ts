export type SignUpType = {
  emailAddress: string;
  password: string;
};
export type SignInType = {
  identifier: string;
  password: string;
};

export enum RegisterType {
  Login,
  Signup,
}

export type StoreCreateType = {
  name: string;
  url: string;
  whatsapp: string;
};
