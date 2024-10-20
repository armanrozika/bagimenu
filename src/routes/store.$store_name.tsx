import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery as tanQuery } from "@tanstack/react-query";
import { useQuery } from "convex/react";
import Select from "react-select";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useState } from "react";
import StoreFrontList from "../components/StoreFrontList";
import { SpinnerPurple } from "../assets";
import { usePublicStableQuery } from "../components/useStableQuery";
import { convexQuery } from "@convex-dev/react-query";

type Filter = {
  name?: string;
};
export const Route = createFileRoute("/store/$store_name")({
  component: StoreFront,
  validateSearch: (search): Filter => {
    return {
      name: search.name as string,
    };
  },
});

function StoreFront() {
  const { name } = Route.useSearch();
  const { store_name } = Route.useParams();
  const navigate = useNavigate({ from: Route.fullPath });
  const itemsPerPage = 20;
  const [categoryId, setCategoryId] = useState<{
    value: Id<"categories"> | "ALL";
    label: string;
  }>({ value: "ALL", label: "All" });
  const {
    results: products,
    isLoading,
    loadMore,
    status,
  } = usePublicStableQuery(categoryId.value, store_name);

  const store_categories = useQuery(api.publicProduct.getStoreDetail, {
    store_url: store_name,
  });
  const { data: searchResult } = tanQuery({
    ...convexQuery(api.publicProduct.searchProduct, {
      searchParams: name ?? "",
      categoryId: categoryId.value,
      store_url: store_name,
    }),
  });

  const renderProducts = () => {
    if (!products && !isLoading) return;
    if (name && !searchResult) return;
    if (name && searchResult) {
      return (
        <StoreFrontList
          products={searchResult}
          store={store_categories?.store!}
        />
      );
    }
    return (
      <StoreFrontList products={products} store={store_categories?.store!} />
    );
  };

  const renderOptions = () => {
    if (!store_categories?.categories) {
      return [{ value: "ALL", label: "All" }];
    }
    const mergedCategories = store_categories.categories.map((category) => {
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
    <div className="bg-gray-100 min-h-[100vh]">
      <div className="text-center py-10 bg-gradient-to-r from-orange-500 to-amber-400 text-white">
        <p className="font-bold text-xl">
          {store_categories?.store?.name.toUpperCase()}
        </p>
      </div>
      <div className="flex justify-between mt-10 mb-7 items-center max-w-[1100px] mx-auto p-2">
        <Select
          options={renderOptions()}
          className="w-1/2 lg:w-1/3 text-sm"
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
          className="border border-gray-200 rounded-lg py-2 px-3 w-1/2 ml-2 lg:w-1/3"
          defaultValue={name}
          onChange={(e) => {
            if (!e.target.value) {
              navigate({
                to: `/store/${store_name}`,
              });
            } else {
              navigate({
                search: (prev) => ({ ...prev, name: e.target.value }),
              });
            }
          }}
        />
      </div>
      {!products && isLoading && status !== "LoadingMore" && (
        <div className="w-[100px] mx-auto">
          <img src={SpinnerPurple} alt="" className="w-[40px] mx-auto" />
        </div>
      )}
      <div className="max-w-[1200px] mx-auto grid grid-cols-2 lg:grid-cols-5 gap-2 lg:gap-6 p-2 lg:p-10">
        {renderProducts()}
      </div>
      <div className="flex justify-center">
        <button
          onClick={() => loadMore(itemsPerPage)}
          disabled={status !== "CanLoadMore"}
          className="border border-orange-500 w-[200px] py-2 my-5 rounded-full text-orange-500 font-semibold text-sm bg-white"
        >
          {status === "LoadingMore" ? "Memuat..." : "Muat Selanjutnya"}
        </button>
      </div>
    </div>
  );
}
