import { createFileRoute, Link } from "@tanstack/react-router";
import { convexQuery } from "@convex-dev/react-query";
import { FiEdit, FiPlusSquare } from "react-icons/fi";
import { api } from "../../../convex/_generated/api";
import { useQuery } from "@tanstack/react-query";
import NoData from "../../components/NoData";
import LoadingLine from "../../components/LoadingLine";
import { LuTrash } from "react-icons/lu";
import { useMutation } from "convex/react";
import toast from "react-hot-toast";

export const Route = createFileRoute("/_private/products/")({
  component: Products,
});

function Products() {
  const { data: products, isLoading } = useQuery({
    ...convexQuery(api.products.get, {}),
  });
  const deleteProduct = useMutation(api.products.deleteProduct);

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

    return products.map((product) => {
      return (
        <div
          key={product._id}
          className="grid grid-cols-4 items-center p-3 border-b border-gray-100 transition hover:bg-gray-100 rounded-xl"
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
                await deleteProduct({ id: product._id });
                toast.success(`${product.name} telah dihapus`);
              }}
              className="ml-7 text-gray-500 cursor-pointer hover:text-rose-500"
            />
          </div>
        </div>
      );
    });
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
      {renderProduk()}
    </>
  );
}
