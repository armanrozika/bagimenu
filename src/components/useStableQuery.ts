import { usePaginatedQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useRef } from "react";
import { Id } from "../../convex/_generated/dataModel";

export const useStableQuery = (categoryId: Id<"categories"> | "ALL") => {
  const itemsPerPage = 20;
  const queryData = usePaginatedQuery(
    api.products.get,
    { id: categoryId },
    { initialNumItems: itemsPerPage }
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
  const itemsPerPage = 20;
  const queryData = usePaginatedQuery(
    api.publicProduct.getProductByCategory,
    { category_id: categoryId, store_url: store_url },
    { initialNumItems: itemsPerPage }
  );

  const stored = useRef(queryData);

  if (queryData.results.length > 0 && !queryData.isLoading) {
    stored.current = queryData;
  }

  return stored.current;
};
