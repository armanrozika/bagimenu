import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import Select from "react-select";

import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import { convexQuery } from "@convex-dev/react-query";

export const Route = createFileRoute("/_private/analytics/")({
  component: Analytics,
});

function Analytics() {
  const day = new Date().setHours(0, 0, 0, 0);
  const month = new Date();
  month.setDate(month.getDate() - (month.getDate() - 1));
  const hh = month.setHours(0, 0, 0, 0);

  const [time, setTime] = useState("DAY");
  const { data: invoices } = useQuery({
    ...convexQuery(api.invoices.getInvoicesReport, {
      time: time,
      date: time === "DAY" ? day : hh,
    }),
  });

  const options = [
    { value: "DAY", label: "Hari Ini" },
    { value: "MONTH", label: "Bulan Ini" },
  ];

  const createDate = (date: number) => {
    const dt = new Date(date);
    const options: any = {
      // weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return dt.toLocaleString("in", options);
  };

  const renderInvoices = () => {
    return invoices?.map((invoice) => {
      return (
        <div
          key={invoice._id}
          className="grid grid-cols-4 text-sm py-2 border-b border-gray-200 tranistion hover:bg-gray-100"
        >
          <p>{invoice.invoice_id}</p>
          <p className="font-semibold text-hitampudar">
            {invoice.product_name}
          </p>
          <p>{createDate(invoice._creationTime)}</p>
          {invoice.status === "PAID" && (
            <p className="border border-ungu w-fit px-3 rounded-full text-ungu bg-indigo-50 ">
              {invoice.status}
            </p>
          )}
          {invoice.status === "CANCELED" && (
            <p className="border border-gray-400 bg-gray-100 w-fit px-3 rounded-full text-gray-500 ">
              {invoice.status.toLowerCase()}
            </p>
          )}
        </div>
      );
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
        <h1 className="font-semibold text-hitampudar">Laporan</h1>
      </div>
      <div className="flex justify-between mt-2 mb-7 items-center">
        <Select
          className="w-1/3 text-sm"
          options={options}
          defaultValue={{ value: "DAY", label: "Hari Ini" }}
          //@ts-ignore
          theme={(theme) => ({
            ...theme,
            borderRadius: "0.5rem",
            colors: {
              ...theme.colors,
              primary25: "#f4f3ff",
              primary: "#8061f1",
            },
          })}
          onChange={(e) => e && setTime(e.value)}
        />
        <input
          type="text"
          placeholder="Cari Nama Produk"
          className="border border-gray-200 rounded-lg py-2 px-3 w-1/3"
        />
      </div>

      <div>{renderInvoices()}</div>
    </div>
  );
}
