import { Link } from "@tanstack/react-router";
import { ProductType } from "../types/types";
import { LuTrash } from "react-icons/lu";
import { FiEdit } from "react-icons/fi";
import toast from "react-hot-toast";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

function ProductList({ products }: { products: ProductType[] }) {
  const deleteProduct = useMutation(api.products.deleteProduct);

  return products.map((product) => {
    return (
      <div
        key={product._id}
        className="grid grid-cols-3 gap-2 items-center p-2 border-b border-gray-100 transition hover:bg-gray-100 rounded-xl"
      >
        <img
          src={product.image_url}
          alt=""
          className="w-[50px] h-[50px] object-cover rounded-full"
        />
        <div>
          <p className="text-hitampudar text-sm font-semibold">
            {product.name}
          </p>
          <p className="text-hitampudar text-sm">
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              maximumFractionDigits: 0,
            }).format(product.price)}
          </p>
        </div>

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
}

export default ProductList;
