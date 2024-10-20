import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { FaRegCircleCheck } from "react-icons/fa6";
import { api } from "../../../convex/_generated/api";
import NoData from "../../components/NoData";
import { useMutation } from "convex/react";
import { Id } from "../../../convex/_generated/dataModel";

export const Route = createFileRoute("/_private/orders/")({
  component: Orders,
});

function Orders() {
  const { data } = useQuery({
    ...convexQuery(api.invoices.getNotification, {}),
  });

  const updateInvoice = useMutation(api.invoices.patch);

  const handleUpdateInvoice = async (
    _id: Id<"invoices">,
    store_id: Id<"stores">,
    status: "PAID" | "CANCELED"
  ) => {
    await updateInvoice({
      _id,
      store_id,
      status,
    });
  };

  const renderInvoices = () => {
    if (!data) return;
    if (data.length < 1) {
      return <NoData text="Belum Ada Order Terbaru" />;
    }
    return data.map((invoice) => {
      return (
        <div
          key={invoice._id}
          className="grid grid-cols-4 items-center py-4 px-3 text-sm border-b border-gray-100 hover:bg-gray-50 transition"
        >
          <p>{invoice.invoice_id}</p>
          <p className="font-semibold">{invoice.product_name}</p>
          <p>
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              maximumFractionDigits: 0,
            }).format(invoice.product_price)}
          </p>
          <div className="flex text-xs items-center ">
            <button
              className="bg-ungu text-white hover:bg-[#4c24db] transition px-3 py-2 rounded font-semibold flex items-center"
              onClick={() =>
                handleUpdateInvoice(invoice._id, invoice.store_id, "PAID")
              }
            >
              <FaRegCircleCheck className="mr-2" />
              Dibayar
            </button>
            <button
              className="bg-gray-200 transition hover:bg-gray-300 px-3 py-2 text-hitampudar rounded ml-5 font-semibold"
              onClick={() =>
                handleUpdateInvoice(invoice._id, invoice.store_id, "CANCELED")
              }
            >
              Dibatalkan
            </button>
          </div>
        </div>
      );
    });
  };

  return (
    <div>
      <div className="pb-3 mb-3 border-b border-gray-100">
        <h1 className="font-semibold text-hitampudar">Order</h1>
      </div>
      <div className="grid grid-cols-4 bg-gray-100 p-3 text-sm text-indigo-700 font-bold">
        <p>Invoice</p>
        <p>Produk</p>
        <p>Total</p>
        <p>Actions</p>
      </div>
      {renderInvoices()}
    </div>
  );
}
