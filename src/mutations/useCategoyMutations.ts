import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "convex/react";
import { CreateCategoryType } from "../types/types";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export const useCategoryMutations = () => {
  const addCategory = useMutation(api.categories.add);
  const patchCategory = useMutation(api.categories.patch);

  const form = useForm<CreateCategoryType>();
  const submitAdd: SubmitHandler<CreateCategoryType> = async (formData) => {
    await addCategory({
      name: formData.name,
    });
  };

  const formPatch = useForm<CreateCategoryType & { id: string }>();
  const submitPatch: SubmitHandler<
    CreateCategoryType & { id: string }
  > = async (formData) => {
    await patchCategory({
      id: formData.id as Id<"categories">,
      name: formData.name,
    });
  };
  return { form, formPatch, submitAdd, submitPatch };
};
