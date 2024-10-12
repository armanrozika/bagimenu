import { createFileRoute, Link } from "@tanstack/react-router";
import { MdOutlineWhatsapp } from "react-icons/md";
import NoData from "../../components/NoData";
import { api } from "../../../convex/_generated/api";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { IoStorefrontOutline } from "react-icons/io5";
import { FiPlusSquare } from "react-icons/fi";

export const Route = createFileRoute("/_private/stores/")({
  component: Toko,
});

function Toko() {
  const { data, isLoading } = useQuery(convexQuery(api.stores.get, {}));

  if (isLoading) {
    return <p>...Loading</p>;
  }
  if (!data) {
    return <p>Error...</p>;
  }

  const renderToko = () => {
    if (data.length < 1) {
      return <NoData />;
    }
    return data.map((store) => {
      return (
        <div
          key={store._id}
          className="grid items-center grid-cols-12 p-5 mt-5 text-sm border border-gray-200 rounded-2xl"
        >
          <div className="flex items-center col-span-6">
            <IoStorefrontOutline className="mr-3 text-4xl text-indigo-400" />
            <div>
              <h1 className="font-semibold text-hitampudar">{store.name}</h1>
              <p className="text-gray-400 ">{store.url}</p>
            </div>
          </div>
          <div className="col-span-3">
            <div className="flex items-center my-2">
              <MdOutlineWhatsapp className="mr-2 text-2xl text-green-600" />
              <p>{store.whatsapp}</p>
            </div>
          </div>
          <div className="flex justify-end col-span-3">
            <p className="underline text-ungu">Edit</p>
          </div>
        </div>
      );
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
        <h1 className="font-semibold text-hitampudar">Toko</h1>
        <Link
          to="/stores/create"
          className="flex items-center px-5 py-2 text-sm font-semibold transition border rounded-full border-ungu text-ungu hover:bg-indigo-50"
        >
          <FiPlusSquare className="mr-2 text-lg" />
          Tambah Toko
        </Link>
      </div>
      {renderToko()}
    </div>
  );
}
