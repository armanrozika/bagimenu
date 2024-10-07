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
