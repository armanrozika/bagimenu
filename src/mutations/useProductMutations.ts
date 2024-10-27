import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useMutation } from "convex/react";
import { useNavigate } from "@tanstack/react-router";
import { CreateProductType, MutationType } from "../types/types";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export const useProductMutation = (
  mutationType: MutationType,
  id: Id<"products">
) => {
  const [imgUrl, setImgUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const addProduct = useMutation(api.products.add);
  const updateProduct = useMutation(api.products.patch);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    getToken: any
  ) => {
    try {
      setLoading(true);
      const token = await getToken();
      if (e.target.files) {
        const formData = new FormData();
        formData.append("image", e.target.files[0]);
        const res = await fetch("https://api.beembingan.com/images", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        form.setValue("image_url", data.image_url);
        setImgUrl(data.image_url);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Error, coba refresh halaman");
    }
  };

  const form = useForm<CreateProductType>({
    defaultValues: {
      category_id: "ALL",
    },
  });
  const submitData: SubmitHandler<CreateProductType> = async (formData) => {
    try {
      if (mutationType === MutationType.Create) {
        const tags = formData.tags.filter((tag) => tag !== false);
        await addProduct({
          name: formData.name,
          price: formData.price,
          image_url: formData.image_url,
          category_id: formData.category_id as Id<"categories">,
          notes: formData.notes,
          tag_ids: tags as Id<"tags">[],
        });
      }
      if (mutationType === MutationType.Patch) {
        //need to read from state, in case user dont want to change image
        //if that's the case, it will not trigger handleFileChange
        //so we need to read image_url from the state
        formData.image_url = imgUrl;
        const tags = formData.tags.filter((tag) => tag !== false);

        await updateProduct({
          id: id,
          tag_ids: tags as Id<"tags">[],
          formData: {
            name: formData.name,
            price: formData.price,
            image_url: formData.image_url,
            category_id: formData.category_id as Id<"categories">,
            notes: formData.notes,
          },
        });
      }
      navigate({ to: "/products" });
    } catch (error) {
      toast.error("Harus ada gambar produk");
      console.log(error);
    }
  };

  return { form, submitData, handleFileChange, imgUrl, loading, setImgUrl };
};
