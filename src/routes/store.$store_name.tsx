import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export const Route = createFileRoute("/store/$store_name")({
  component: StoreFront,
});

function StoreFront() {
  const { store_name } = Route.useParams();

  const products = useQuery(api.publicProduct.getProductByCategory, {
    id: "ALL",
    store_url: store_name,
  });

  const renderProducts = () => {
    if (!products) return;
    return products.map((product) => {
      return (
        <div key={product._id} className=" border-gray-200 rounded-lg">
          <img src={product.image_url} alt="" />
          <div className="p-5">
            <p className="">{product.name}</p>
            <p>
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0,
              }).format(product.price)}
            </p>
            <button className="bg-orange-500 w-full py-2 mt-3 rounded text-white text-sm font-semibold">
              Pesan Whatsapp
            </button>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="max-w-[1200px] mx-auto grid grid-cols-5 gap-7 p-10">
      {renderProducts()}
    </div>
  );
}
