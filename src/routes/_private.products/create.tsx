import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@clerk/clerk-react";
import Select from "react-select";
import { useQuery } from "convex/react";
import BackTitle from "../../components/BackTitle";
import { useProductMutation } from "../../mutations/useProductMutations";
import { SpinnerPurple, SpinnerWhite } from "../../assets";
import { MutationType } from "../../types/types";
import { Id } from "../../../convex/_generated/dataModel";
import { api } from "../../../convex/_generated/api";
import { LiaTagsSolid } from "react-icons/lia";

export const Route = createFileRoute("/_private/products/create")({
  component: CreateProduct,
});

function CreateProduct() {
  const { getToken } = useAuth();
  const { form, submitData, imgUrl, loading, handleFileChange } =
    useProductMutation(MutationType.Create, "_" as Id<"products">);
  const categories = useQuery(api.categories.get);
  const tags = useQuery(api.tags.get);

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
  const renderTags = () => {
    if (!tags || tags === "no_default_store") return;
    return tags.map((tag, idx) => {
      return (
        <div key={tag._id} className="inline-block mr-3 items-center">
          <div className="flex items-center">
            <input
              {...form.register(`tags.${idx}`)}
              type="checkbox"
              id={tag._id}
              className="mr-1"
              value={tag._id}
            />
            <label
              htmlFor={tag._id}
              className="cursor-pointer text-sm text-hitampudar"
            >
              {tag.name}
            </label>
          </div>
        </div>
      );
    });
  };

  return (
    <form onSubmit={form.handleSubmit(submitData)}>
      <BackTitle backTo="/products" title="Tambah Produk" />
      <div className="border border-gray-100 rounded-2xl">
        <div className="lg:grid grid-cols-2 gap-10">
          <div className="p-7 relative">
            <img
              src={imgUrl || "https://placehold.co/100x100?text=Gambar"}
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
              required
              type="text"
              placeholder="Nama Produk"
              className="w-full border border-gray-200 p-3 rounded-lg my-2"
              {...form.register("name")}
            />
            <input
              required
              type="number"
              placeholder="Harga (tanpa titik & koma)"
              className="w-full border border-gray-200 p-3 rounded-lg mb-2"
              {...form.register("price", {
                valueAsNumber: true,
              })}
            />
            <textarea
              {...form.register("notes")}
              placeholder="Keterangan"
              className="border border-gray-200 rounded-lg w-full h-20 p-3"
            ></textarea>
            <div className="mt-2">
              <p className="text-sm text-hitampudar mb-1">Kategori: </p>
              <Select
                required
                options={renderOptions()}
                className=""
                defaultValue={{ value: "ALL", label: "All" }}
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
        <div className="px-7 w-full mb-7">
          <div className="flex items-center my-2">
            <LiaTagsSolid className="mr-1 text-xl text-ungu" />
            <p className="text-ungu font-semibold text-sm">Tags: </p>
          </div>
          {renderTags()}
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
