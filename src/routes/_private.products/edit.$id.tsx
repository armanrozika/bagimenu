import { useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import Select from "react-select";
import { useAuth } from "@clerk/clerk-react";
import BackTitle from "../../components/BackTitle";
import { useProductMutation } from "../../mutations/useProductMutations";
import { MutationType } from "../../types/types";
import { Id } from "../../../convex/_generated/dataModel";
import { SpinnerPurple, SpinnerWhite } from "../../assets";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export const Route = createFileRoute("/_private/products/edit/$id")({
  component: EditProduct,
});

function EditProduct() {
  const { id } = Route.useParams();
  const { form, submitData, loading, imgUrl, setImgUrl, handleFileChange } =
    useProductMutation(MutationType.Patch, id as Id<"products">);
  const categories = useQuery(api.categories.get);

  const product = useQuery(api.products.getProduct, {
    id: id as Id<"products">,
  });

  const { getToken } = useAuth();

  useEffect(() => {
    if (product) {
      setImgUrl(product.image_url);
    }
  }, [product]);

  const renderOptions = () => {
    if (!categories || categories === "no_default_store") {
      return [{ value: "ALL", label: "All" }];
    } else {
      const mergedCategories = categories.map((category) => {
        return {
          value: category._id,
          label: category.name,
        };
      });
      mergedCategories.unshift({
        value: "ALL" as Id<"categories">,
        label: "All",
      });
      return mergedCategories;
    }
  };

  const autoSelectedCategory = () => {
    if (!product) return;
    //no categories = user haven't create one yet
    if (categories === "no_default_store") {
      return [{ value: "ALL", label: "All" }];
    }
    const productCategory = categories?.find(
      (category) => category._id === product.category_id
    );
    if (productCategory) {
      form.setValue("category_id", productCategory._id);
      return {
        value: productCategory._id,
        label: productCategory.name,
      };
    } else {
      //this means product's category is deleted
      //or product's category is All
      return [{ value: "ALL", label: "All" }];
    }
  };

  const renderCategoryMissingWarning = () => {
    if (!product) return;
    if (categories === "no_default_store") return;
    const productCategory = categories?.find(
      (category) => category._id === product.category_id
    );
    if (!productCategory && product?.category_id !== "ALL") {
      return (
        <div className="text-center text-sm text-gray-400 mb-3">
          <p>
            Kategori produk ini sudah terhapus. Silakan ganti dengan yang baru
          </p>
        </div>
      );
    }
  };

  return (
    <form onSubmit={form.handleSubmit(submitData)}>
      <BackTitle backTo="/products" title="Edit Produk" />
      {product && (
        <>
          {renderCategoryMissingWarning()}
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
                onChange={(e) => handleFileChange(e, getToken)}
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
              <div className="mt-2">
                <p className="text-sm text-hitampudar mb-1">Kategori: </p>
                <Select
                  required
                  options={renderOptions()}
                  className=" text-sm"
                  defaultValue={autoSelectedCategory()}
                  //@ts-ignore
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: "0.5rem",
                    colors: {
                      ...theme.colors,
                      primary25: "#f4f3ff",
                      primary: "#8061f1",
                    },
                  })}
                  onChange={(e) => {
                    form.setValue("category_id", e!.value);
                  }}
                />
              </div>
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
