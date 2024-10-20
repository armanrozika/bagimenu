import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery as tanQuery } from "@tanstack/react-query";
import { FiPlusSquare } from "react-icons/fi";
import Select from "react-select";
import { api } from "../../../convex/_generated/api";
import NoData from "../../components/NoData";
import LoadingLine from "../../components/LoadingLine";
import { useQuery } from "convex/react";
import { Id } from "../../../convex/_generated/dataModel";
import ProductList from "../../components/ProductList";
import { convexQuery } from "@convex-dev/react-query";
import { useStableQuery } from "../../components/useStableQuery";

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

  const user = useQuery(api.users.get);
  const categories = useQuery(api.categories.get);
  const itemsPerPage = 20;
  const {
    results: products,
    isLoading,
    loadMore,
    status,
  } = useStableQuery(categoryId.value);

  const { data: searchResult } = tanQuery({
    ...convexQuery(api.products.searchProduct, {
      searchParams: name ?? "",
      categoryId: categoryId.value,
    }),
  });

  const renderProduk = () => {
    if (!products && !isLoading) return;
    if (user?.default_store === null) {
      return <NoData text="Silakan Buat Toko Terlebih Dahulu" />;
    }
    if (products.length < 1 && !isLoading) {
      return <NoData text="Belum Ada Produk" />;
    }

    if (name && searchResult) {
      return <ProductList products={searchResult} />;
    }
    return <ProductList products={products} />;
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

      {!products && isLoading && <LoadingLine />}

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
          onClick={() => loadMore(itemsPerPage)}
          disabled={status !== "CanLoadMore"}
          className="text-sm text-ungu border border-ungu rounded-full font-semibold px-8 py-1.5 hover:bg-indigo-50 transition disabled:cursor-not-allowed"
        >
          More
        </button>
      </div>
    </>
  );
}
