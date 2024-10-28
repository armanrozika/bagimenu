import { createFileRoute, Link } from "@tanstack/react-router";
import { MdOutlineContentCopy, MdOutlineWhatsapp } from "react-icons/md";
import NoData from "../../components/NoData";
import { api } from "../../../convex/_generated/api";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { IoStorefrontOutline } from "react-icons/io5";
import { FiEdit, FiPlusSquare } from "react-icons/fi";
import LoadingLine from "../../components/LoadingLine";
import toast from "react-hot-toast";
import Select from "react-select";
import { useMutation } from "convex/react";

export const Route = createFileRoute("/_private/stores/")({
  component: Toko,
});
function Toko() {
  const { data: stores } = useQuery({
    ...convexQuery(api.stores.getStoresWithDefault, {}),
  });
  const updateDefaultStore = useMutation(api.stores.updateDefaultStore);

  const renderToko = () => {
    if (stores == undefined) return;
    if (stores.length < 1) {
      return <NoData text="Buat Toko dengan Klik Tombol Tambah Toko" />;
    }
    return stores.map((store) => {
      return (
        <div
          key={store._id}
          className="lg:grid items-center grid-cols-12 mt-5 text-sm transition border border-gray-200 p-7 rounded-2xl hover:bg-gray-50"
        >
          <div className="flex items-center col-span-6">
            <IoStorefrontOutline className="mr-5 text-4xl text-indigo-400" />
            <div>
              <h1 className="font-semibold text-hitampudar">{store.name}</h1>
              <div className="flex items-center">
                <Link
                  to={`/${store.url}`}
                  target="_blank"
                  className="text-indigo-500"
                >
                  bagimenu.com/{store.url}
                </Link>
                <MdOutlineContentCopy
                  className="text-lg ml-3 text-gray-400 cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `https://bagimenu.com/${store.url}`
                    );
                    toast.success("URL berhasil dicopy");
                  }}
                />
              </div>
            </div>
          </div>
          <div className="col-span-3">
            <div className="flex items-center my-2">
              <MdOutlineWhatsapp className="mr-2 text-2xl text-green-500" />
              <p className="text-hitampudar">{store.whatsapp}</p>
            </div>
          </div>
          <div className="flex justify-end col-span-3 items-center">
            <Link to={`/stores/edit/${store._id}`} className=" text-ungu">
              <FiEdit className="text-lg" />
            </Link>
          </div>
        </div>
      );
    });
  };

  const renderOptions = () => {
    if (!stores || stores.length < 1) return;
    return stores;
  };

  const renderSelect = () => {
    if (stores === undefined) return;
    const value = stores.find((store) => store.is_default === true);
    // return value;
    return (
      <Select
        className="lg:w-1/4"
        options={renderOptions()}
        defaultValue={value}
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
        onChange={(e) => {
          if (e && e.value) {
            updateDefaultStore({ id: e.value });
          }
        }}
      />
    );
  };

  return (
    <>
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

      {stores === undefined && <LoadingLine />}

      <div className="lg:flex items-center">
        <p className="mr-3 text-sm text-hitampudar">Sedang Dikelola:</p>
        {renderSelect()}
      </div>

      {renderToko()}
    </>
  );
}
