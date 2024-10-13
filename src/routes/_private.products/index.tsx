import { createFileRoute, Link } from "@tanstack/react-router";
import { convexQuery } from "@convex-dev/react-query";
import { FiPlusSquare } from "react-icons/fi";
import { api } from "../../../convex/_generated/api";
import { useQuery } from "@tanstack/react-query";
import NoData from "../../components/NoData";
import LoadingLine from "../../components/LoadingLine";

export const Route = createFileRoute("/_private/products/")({
  component: Products,
});

function Products() {
  const { data: products, isLoading } = useQuery({
    ...convexQuery(api.products.get, {}),
  });

  const renderProduk = () => {
    if (isLoading) {
      return <LoadingLine />;
    }
    if (!products) return;

    if (products === "no store") {
      return <NoData text="Silakan Buat Toko Terlebih Dahulu" />;
    }

    if (products.length < 1) {
      return <NoData text="Belum Ada Produk" />;
    }
  };

  return (
    <>
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
        <h1 className="font-semibold text-hitampudar">Produk</h1>
        <Link
          disabled={products === "no store"}
          to="/products/create"
          className="flex items-center px-5 py-2 text-sm font-semibold transition border rounded-full border-ungu text-ungu hover:bg-indigo-50"
        >
          <FiPlusSquare className="mr-2 text-lg" />
          Tambah Produk
        </Link>
      </div>
      <div className="mt-5">{renderProduk()}</div>
    </>
  );
}
