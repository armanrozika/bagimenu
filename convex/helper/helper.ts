import { DataModel } from "../_generated/dataModel";
import {
  GenericDataModel,
  GenericMutationCtx,
  GenericQueryCtx,
} from "convex/server";

export const authorizeUser = async (
  ctx: GenericMutationCtx<DataModel> | GenericQueryCtx<DataModel>,
  error: string
) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error(error);
  }
  return identity;
};
