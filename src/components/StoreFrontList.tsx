import { useMutation } from "convex/react";
import { FaWhatsapp } from "react-icons/fa";
import { api } from "../../convex/_generated/api";
import { ProductType, StoreType } from "../types/types";

type PropsType = {
  products: ProductType[];
  store: StoreType;
};

function StoreFrontList({ products, store }: PropsType) {
  const createInvoice = useMutation(api.invoices.add);

  const generateInvoiceId = () => {
    const st = store.url.toUpperCase().slice(0, 3);
    const dt = new Date().toLocaleDateString().replaceAll("/", "");
    const hh = new Date().getHours();
    const mm = new Date().getMinutes();
    const ss = new Date().getSeconds();

    const inv = `${st}-${dt}-${hh}${mm}${ss}`;

    return inv;
  };

  const sendInvoice = async (product_name: string, product_price: number) => {
    const generatedId = generateInvoiceId();
    await createInvoice({
      invoice_id: generatedId,
      product_name,
      product_price,
      is_success: false,
      store_id: store._id,
    });
  };

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
            <button
              className="bg-[#fa931c] w-full py-2.5 mt-2 rounded-md text-white text-sm font-semibold flex justify-center items-center"
              onClick={() => sendInvoice(product.name, product.price)}
            >
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
