"use node";

import { action } from "./_generated/server";

import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: "public_+J9ulTfiQYH9h+hkrGGXLHXCRp8=",
  //@ts-ignore
  privateKey: process.env.IMAGEKIT,
  urlEndpoint: "https://ik.imagekit.io/bagimenu",
});

export const add = action({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Non Auothorized Actions!");
    }
    const authenticationParameters = imagekit.getAuthenticationParameters();
    return authenticationParameters;
  },
});
