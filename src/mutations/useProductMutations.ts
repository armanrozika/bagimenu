import { SubmitHandler, useForm } from "react-hook-form";
import { CreateProductType, MutationType } from "../types/types";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import toast from "react-hot-toast";
import { useNavigate } from "@tanstack/react-router";
import { Id } from "../../convex/_generated/dataModel";
import { useState } from "react";

export const useProductMutation = (
  mutationType: MutationType,
  id: Id<"products">
) => {
  const [imgUrl, setImgUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const addProduct = useMutation(api.products.add);
  const updateProduct = useMutation(api.products.patch);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setLoading(true);
      if (e.target.files) {
        const formData = new FormData();
        formData.append("image", e.target.files[0]);
        const res = await fetch("https://api.beembingan.com/images", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        form.register("image_url", {
          value: data.image_url,
        });
        setImgUrl(data.image_url);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      toast.error("Error, coba refresh halaman");
    }
  };

  const form = useForm<CreateProductType>();
  const submitData: SubmitHandler<CreateProductType> = async (formData) => {
    try {
      if (mutationType === MutationType.Create) {
        await addProduct(formData);
      }
      if (mutationType === MutationType.Patch) {
        formData.image_url = imgUrl;
        await updateProduct({ id: id, formData: formData });
      }
      navigate({ to: "/products" });
    } catch (error) {
      toast.error("Network Error");
      console.log(error);
    }
  };

  return { form, submitData, handleFileChange, imgUrl, loading, setImgUrl };
};
