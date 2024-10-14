import { createFileRoute, Link } from "@tanstack/react-router";
import BackTitle from "../../components/BackTitle";
import { useProductMutation } from "../../mutations/useProductMutations";
import { MutationType } from "../../types/types";
import { Id } from "../../../convex/_generated/dataModel";
import { SpinnerPurple, SpinnerWhite } from "../../assets";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useEffect } from "react";

export const Route = createFileRoute("/_private/products/edit/$id")({
  component: EditProduct,
});

function EditProduct() {
  const { id } = Route.useParams();
  const { form, submitData, loading, imgUrl, setImgUrl, handleFileChange } =
    useProductMutation(MutationType.Patch, id as Id<"products">);

  const product = useQuery(api.products.getProduct, {
    id: id as Id<"products">,
  });

  useEffect(() => {
    if (product) {
      setImgUrl(product.image_url);
    }
  }, [product]);

  return (
    <form onSubmit={form.handleSubmit(submitData)}>
      <BackTitle backTo="/products" title="Tambah Produk" />
      {product && (
        <>
          <div className="border border-gray-100 rounded-2xl grid grid-cols-2 gap-10">
            <div className="p-7 relative">
              <img
                src={imgUrl || "https://placehold.co/250x250?text=Gambar"}
                alt=""
                className="w-[250px] h-[250px] object-cover mx-auto mb-1 rounded-2xl"
              />
              {loading && (
                <div className="absolute w-32 h-32 m-auto left-0 right-0 top-0 bottom-20">
                  <img src={SpinnerPurple} alt="" className="" />
                </div>
              )}

              <p className="text-center text-hitampudar mb-2 mt-4 text-sm">
                Upload Gambar Produk
              </p>
              <label htmlFor="file-input" className="cursor-pointer sr-only">
                Choose
              </label>
              <input
                type="file"
                id="file-input"
                className="block w-full text-sm border border-gray-200 rounded-lg shadow-sm cursor-pointer focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none file:bg-gray-50 file:border-0 file:me-4 file:py-3 file:px-4 "
                onChange={handleFileChange}
              />
            </div>
            <div className="p-7">
              <input
                defaultValue={product.name}
                required
                type="text"
                placeholder="Nama Produk"
                className="w-full border border-gray-200 p-3 rounded-lg my-2"
                {...form.register("name")}
              />
              <input
                defaultValue={product.price}
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
        </>
      )}
    </form>
  );
}