import { usePaginatedQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useRef } from "react";
import { Id } from "../../convex/_generated/dataModel";

export const useStableQuery = (categoryId: Id<"categories"> | "ALL") => {
  const itemsPerPage = 2;
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
