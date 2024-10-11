import { SubmitHandler, useForm } from "react-hook-form";
import { StoreCreateType } from "../types/types";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import toast from "react-hot-toast";
import { useNavigate } from "@tanstack/react-router";

export const useStoreMutations = () => {
  const mutate = useMutation(api.stores.add);
  const navigate = useNavigate();
  const storeForm = useForm<StoreCreateType>();
  const submitCreateForm: SubmitHandler<StoreCreateType> = async (formData) => {
    try {
      await mutate(formData);
      navigate({ to: "/stores" });
    } catch (error) {
      toast.error("Something unexpected");
      console.log(error);
    }
  };

  return { storeForm, submitCreateForm };
};
