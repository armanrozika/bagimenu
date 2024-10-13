import { SubmitHandler, useForm } from "react-hook-form";
import { CreateProductType } from "../types/types";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import toast from "react-hot-toast";
import { useNavigate } from "@tanstack/react-router";

export const useProductMutation = () => {
  const navigate = useNavigate();
  const addProduct = useMutation(api.products.add);
  const form = useForm<CreateProductType>();
  const submitData: SubmitHandler<CreateProductType> = async (formData) => {
    try {
      await addProduct(formData);
      navigate({ to: "/products" });
    } catch (error) {
      toast.error("Network Error");
      console.log(error);
    }
  };

  return { form, submitData };
};
