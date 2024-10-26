import { SubmitHandler, useForm } from "react-hook-form";
import { TagType } from "../types/types";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export const useTagMutations = () => {
  const addTag = useMutation(api.tags.add);
  const form = useForm<TagType>();
  const submitData: SubmitHandler<TagType> = async (formData) => {
    await addTag({ name: formData.name });
  };

  return { form, submitData };
};
