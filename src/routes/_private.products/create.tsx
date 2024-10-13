import { createFileRoute, Link } from "@tanstack/react-router";
import { IKContext, IKUpload } from "imagekitio-react";
import { useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import BackTitle from "../../components/BackTitle";
import { useState } from "react";
import toast from "react-hot-toast";
import { useProductMutation } from "../../mutations/useProductMutations";
import { SpinnerWhite } from "../../assets";

export const Route = createFileRoute("/_private/products/create")({
  component: CreateProduct,
});

function CreateProduct() {
  const [imgUrl, setImgUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const product = useAction(api.actionProduct.add);
  const { form, submitData } = useProductMutation();

  const renderImageKit = () => {
    const authenticator = async () => {
      try {
        const secret = await product();
        const data = secret;
        const { signature, expire, token } = data;
        return { signature, expire, token };
      } catch (error) {
        throw new Error(`Authentication request failed`);
      }
    };
    return (
      <IKContext
        publicKey="public_+J9ulTfiQYH9h+hkrGGXLHXCRp8="
        urlEndpoint="https://ik.imagekit.io/bagimenu"
        authenticator={authenticator}
      >
        <IKUpload
          fileName="/user/abc.jpg"
          tags={["tag1"]}
          useUniqueFileName={true}
          isPrivateFile={false}
          onUploadStart={() => {
            setLoading(true);
          }}
          onError={(error) => {
            setLoading(false);
            toast.error("Error, please try again");
            console.log(error);
          }}
          onSuccess={(response) => {
            setLoading(false);
            setImgUrl(response.url);
            form.register("image_url", {
              value: response.url,
            });
          }}
          className="border border-gray-200 rounded-lg p-2 cursor-pointer text-gray-400"
        />
      </IKContext>
    );
  };

  return (
    <form onSubmit={form.handleSubmit(submitData)}>
      <BackTitle backTo="/products" title="Tambah Produk" />
      <div className="border border-gray-100 rounded-2xl grid grid-cols-2 gap-10">
        <div className="p-7">
          <img
            src={imgUrl || "https://placehold.co/600x400?text=Gambar"}
            alt=""
            className="w-[250px] h-[250px] object-cover mx-auto mb-1 rounded-2xl"
          />
          {loading && (
            <div className="bg-gradient-to-tr from-violet-600 via-violet-600 to-indigo-600 h-[1px] animate-ping w-[100px] mx-auto rounded-xl"></div>
          )}

          <p className="text-center text-hitampudar mb-2 mt-4 text-sm">
            Upload Gambar Produk
          </p>
          {renderImageKit()}
        </div>
        <div className="p-7">
          <input
            required
            type="text"
            placeholder="Nama Produk"
            className="w-full border border-gray-200 p-3 rounded-lg my-2"
            {...form.register("name")}
          />
          <input
            required
            type="number"
            placeholder="Harga"
            className="w-full border border-gray-200 p-3 rounded-lg my-2"
            {...form.register("price", {
              valueAsNumber: true,
            })}
          />
        </div>
      </div>
      <div className="flex justify-end mt-7">
        <Link
          activeProps={{}}
          to="/products"
          className="bg-gray-100 font-semibold text-sm text-center text-hitampudar w-[100px] py-2 rounded-lg hover:bg-gray-200 transition"
        >
          Batal
        </Link>
        <button
          type="submit"
          className="ml-7 bg-ungu text-white text-sm font-semibold w-[100px] rounded-lg py-2"
        >
          {form.formState.isSubmitting ? (
            <img src={SpinnerWhite} className="w-[20px] mx-auto" />
          ) : (
            "Simpan"
          )}
        </button>
      </div>
    </form>
  );
}
