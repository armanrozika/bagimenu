import { usePaginatedQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useRef } from "react";
import { Id } from "../../convex/_generated/dataModel";
import { ITEMS_PER_PAGE } from "../constants/constants";

export const useStableQuery = (categoryId: Id<"categories"> | "ALL") => {
  const queryData = usePaginatedQuery(
    api.products.get,
    { id: categoryId },
    { initialNumItems: ITEMS_PER_PAGE }
  );

  const stored = useRef(queryData);

  if (queryData.results.length > 0 && !queryData.isLoading) {
    stored.current = queryData;
  }

  return stored.current;
};

export const usePublicStableQuery = (
  categoryId: Id<"categories"> | "ALL",
  store_url: string
) => {
  const queryData = usePaginatedQuery(
    api.publicProduct.getProductByCategory,
    { category_id: categoryId, store_url: store_url },
    { initialNumItems: ITEMS_PER_PAGE }
  );

  const stored = useRef(queryData);

  if (queryData.results.length > 0 && !queryData.isLoading) {
    stored.current = queryData;
  }

  return stored.current;
};
