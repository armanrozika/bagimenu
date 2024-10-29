import { useMutation } from "convex/react";
import { FaWhatsapp } from "react-icons/fa";
import { api } from "../../convex/_generated/api";
import { ProductType, StoreType } from "../types/types";
import { FiZoomIn } from "react-icons/fi";
import Modal from "./Modal";
import { useState } from "react";

type PropsType = {
  products: ProductType[];
  store: StoreType;
};

function StoreFrontList({ products, store }: PropsType) {
  const createInvoice = useMutation(api.invoices.add);
  const [showModal, setShowModal] = useState(false);
  const [activeProduct, setActiveProduct] = useState<ProductType | undefined>();

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
    const popup = window.open("");
    const generatedId = generateInvoiceId();
    await createInvoice({
      invoice_id: generatedId,
      product_name,
      product_price,
      is_success: false,
      store_id: store._id,
    });
    popup!.location.href = `https://wa.me/+62${store.whatsapp}/?text=Halo kak, saya mau pesan ${product_name}, dengan harga ${formatPrice(product_price)} Terima kasih. [Id: ${generatedId}].`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatTitle = (title: string) => {
    if (title.length > 16) {
      return title.slice(0, 15) + "...";
    }
    return title;
  };

  const renderProducts = () => {
    if (!products) return;
    return products.map((product: ProductType) => {
      return (
        <div
          key={product._id}
          className=" bg-white flex flex-col justify-between rounded p-2 shadow-sm"
        >
          <div
            className="relative"
            onClick={() => {
              setActiveProduct(product);
              setShowModal(true);
            }}
          >
            <img src={product.image_url} alt="" className="cursor-pointer" />
            <FiZoomIn className="absolute cursor-pointer flex top-1/2 text-2xl left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-white" />
          </div>
          <div className="p-2 mb-auto">
            <p className="text-hitampudar text-center text-sm">
              {formatTitle(product.name)}
            </p>
            <p className="text-sm mt-2 mb-3 text-center">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0,
              }).format(product.price)}
            </p>
            {/* <Link
              target="_blank"
              to={`https://wa.me/+62${store.whatsapp}/?text=Halo kak, saya mau pesan ${product.name}: ${product.notes}, dengan harga ${formatPrice(product.price)} Terima kasih`}
              className="px-6 bg-amber-500 text-white rounded py-2 shadow-md"
            >
              Pesan via WhatsApp
            </Link> */}
            <button
              className="bg-[#fa931c] w-full py-2 mt-2 rounded-lg text-white text-sm font-semibold flex justify-center items-center"
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
  return (
    <>
      {renderProducts()}
      {showModal && (
        <Modal setShowModal={setShowModal} activeProduct={activeProduct} />
      )}
    </>
  );
}

export default StoreFrontList;
