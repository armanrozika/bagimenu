import { FaWhatsapp } from "react-icons/fa";

function StoreFrontList({ products }: { products: any }) {
  const renderProducts = () => {
    if (!products) return;
    return products.map((product: any) => {
      return (
        <div key={product._id} className=" bg-white rounded-md p-2 shadow">
          <img src={product.image_url} alt="" />
          <div className="p-2">
            <p className="text-hitampudar font-semibold text-center">
              {product.name}
            </p>
            <p className="text-sm mt-2 mb-3 text-center">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0,
              }).format(product.price)}
            </p>
            <button className="bg-[#fa931c] w-full py-2.5 mt-2 rounded-md text-white text-sm font-semibold flex justify-center items-center">
              Pesan
              <FaWhatsapp className="ml-2 text-lg font-bold" />
            </button>
          </div>
        </div>
      );
    });
  };
  return <>{renderProducts()}</>;
}

export default StoreFrontList;
