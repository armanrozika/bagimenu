import { SubmitHandler, useForm } from "react-hook-form";
import { MutationType, StoreCreateType } from "../types/types";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import toast from "react-hot-toast";
import { useNavigate } from "@tanstack/react-router";
import { Id } from "../../convex/_generated/dataModel";

export const useStoreMutations = (
  mutationType: MutationType,
  id: Id<"stores">
) => {
  const mutate = useMutation(api.stores.add);
  const patch = useMutation(api.stores.updateStore);
  const navigate = useNavigate();

  const storeForm = useForm<StoreCreateType>();
  const submitCreateForm: SubmitHandler<StoreCreateType> = async (formData) => {
    try {
      if (mutationType === MutationType.Create) {
        await mutate(formData);
      }
      if (mutationType === MutationType.Patch) {
        await patch({ id: id, formData: formData });
      }
      navigate({ to: "/stores" });
    } catch (error: any) {
      toast.error(error.data);
    }
  };

  return { storeForm, submitCreateForm };
};
