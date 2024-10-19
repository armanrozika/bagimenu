import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { FiEdit, FiPlusSquare } from "react-icons/fi";
import toast from "react-hot-toast";
import Select from "react-select";
import { LuTrash } from "react-icons/lu";
import { api } from "../../../convex/_generated/api";
import NoData from "../../components/NoData";
import LoadingLine from "../../components/LoadingLine";
import {
  useMutation,
  useQuery as dbQuery,
  usePaginatedQuery,
  useQuery,
} from "convex/react";
import { Id } from "../../../convex/_generated/dataModel";
import SearchResult from "../../components/SearchResult";

type Filter = {
  name?: string;
};

export const Route = createFileRoute("/_private/products/")({
  component: Products,
  validateSearch: (search): Filter => {
    return {
      name: search.name as string,
    };
  },
});

function Products() {
  const [categoryId, setCategoryId] = useState<{
    value: Id<"categories"> | "ALL";
    label: string;
  }>({ value: "ALL", label: "All" });
  const navigate = useNavigate({ from: Route.fullPath });
  const { name } = Route.useSearch();

  const user = dbQuery(api.users.get);
  const categories = dbQuery(api.categories.get);

  const {
    results: products,
    isLoading,
    loadMore,
    status,
  } = usePaginatedQuery(
    api.products.get,
    { id: categoryId.value },
    { initialNumItems: 20 }
  );

  const searchResult = useQuery(api.products.searchProduct, {
    searchParams: name ?? "",
    categoryId: categoryId.value,
  });

  const deleteProduct = useMutation(api.products.deleteProduct);

  const renderProduk = () => {
    if (!products && !isLoading) return;
    if (user?.default_store === null) {
      return <NoData text="Silakan Buat Toko Terlebih Dahulu" />;
    }
    if (products.length < 1 && !isLoading) {
      return <NoData text="Belum Ada Produk" />;
    }
    if (name && !searchResult) return;
    if (name && searchResult) {
      return <SearchResult products={searchResult} />;
    }

    return products.map((product) => {
      return (
        <div
          key={product._id}
          className="grid grid-cols-4 gap-2 items-center p-3 border-b border-gray-100 transition hover:bg-gray-100 rounded-xl"
        >
          <img
            src={product.image_url}
            alt=""
            className="w-[50px] h-[50px] object-cover rounded-full"
          />
          <p className="text-hitampudar text-sm font-semibold">
            {product.name}
          </p>
          <p className="text-hitampudar text-sm">{product.price}</p>
          <div className="text-lg flex justify-end">
            <Link to={`/products/edit/${product._id}`}>
              <FiEdit className="text-indigo-500 hover:text-ungu cursor-pointer" />
            </Link>
            <LuTrash
              onClick={async () => {
                try {
                  await deleteProduct({ id: product._id });
                  toast.success(`${product.name} berhasil dihapus`);
                } catch (error) {
                  toast.error("Terjadi kesalahan");
                }
              }}
              className="ml-7 text-gray-500 cursor-pointer hover:text-rose-500"
            />
          </div>
        </div>
      );
    });
  };

  const renderOptions = () => {
    if (!categories || categories === "no_default_store") {
      return [{ value: "ALL", label: "All" }];
    }
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
  };

  return (
    <>
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
        <h1 className="font-semibold text-hitampudar">Produk</h1>
        <Link
          disabled={user?.default_store === null}
          to="/products/create"
          className="flex items-center px-5 py-2 text-sm font-semibold transition border rounded-full border-ungu text-ungu hover:bg-indigo-50"
        >
          <FiPlusSquare className="mr-2 text-lg" />
          Tambah Produk
        </Link>
      </div>

      {isLoading && <LoadingLine />}

      <div className="flex justify-between mt-2 mb-7 items-center">
        <Select
          options={renderOptions()}
          className="w-1/3 text-sm"
          defaultValue={{ value: "ALL", label: "All" }}
          value={categoryId}
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
            e &&
              setCategoryId({
                value: e.value as Id<"categories">,
                label: e.label,
              });
          }}
        />
        <input
          type="text"
          placeholder="Cari Nama Produk"
          className="border border-gray-200 rounded-lg py-2 px-3 w-1/3"
          defaultValue={name}
          onChange={(e) => {
            if (!e.target.value) {
              navigate({
                to: "/products",
              });
              // setIsFromSearch(false);
            } else {
              navigate({
                search: (prev) => ({ ...prev, name: e.target.value }),
              });
            }
          }}
        />
      </div>
      <div className="max-h-[60vh] overflow-y-auto">{renderProduk()}</div>
      <div className="flex justify-center mt-5">
        <button
          onClick={() => loadMore(20)}
          disabled={status !== "CanLoadMore"}
          className="text-sm text-ungu border border-ungu rounded-full font-semibold px-8 py-1.5 hover:bg-indigo-50 transition disabled:cursor-not-allowed"
        >
          More
        </button>
      </div>
    </>
  );
}
