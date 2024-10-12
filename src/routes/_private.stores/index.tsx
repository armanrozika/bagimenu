import { createFileRoute, Link } from "@tanstack/react-router";
import { MdOutlineWhatsapp } from "react-icons/md";
import NoData from "../../components/NoData";
import { api } from "../../../convex/_generated/api";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { IoStorefrontOutline } from "react-icons/io5";
import { FiEdit, FiPlusSquare } from "react-icons/fi";
// import { LuTrash } from "react-icons/lu";

export const Route = createFileRoute("/_private/stores/")({
  component: Toko,
});

function Toko() {
  const { data, isLoading } = useQuery(convexQuery(api.stores.get, {}));
  const { data: user } = useQuery(convexQuery(api.users.get, {}));

  if (isLoading) {
    return <p>...Loading</p>;
  }
  if (!data) {
    return <p>Error...</p>;
  }

  const renderToko = () => {
    if (data.length < 1) {
      return <NoData text="Buat Toko dengan Klik Tombol Tambah Toko" />;
    }
    return data.map((store) => {
      return (
        <div
          key={store._id}
          className="grid items-center grid-cols-12 mt-5 text-sm transition border border-gray-200 p-7 rounded-2xl hover:bg-gray-50"
        >
          <div className="flex items-center col-span-6">
            <IoStorefrontOutline className="mr-5 text-4xl text-indigo-400" />
            <div>
              <h1 className="font-semibold text-hitampudar">{store.name}</h1>
              <Link to="/stores" target="_blank" className="text-indigo-400">
                bagimenu.com/{store.url}
              </Link>
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
            {/* <LuTrash className="text-gray-500 text-lg cursor-pointer ml-7" /> */}
          </div>
        </div>
      );
    });
  };

  const renderAddStoreButton = () => {
    if (!user) return;
    const disableCreate = user.plan === "basic" && data.length === 1;
    return (
      <Link
        disabled={disableCreate}
        to="/stores/create"
        className="flex items-center px-5 py-2 text-sm font-semibold transition border rounded-full border-ungu text-ungu hover:bg-indigo-50"
      >
        <FiPlusSquare className="mr-2 text-lg" />
        Tambah Toko
      </Link>
    );
  };

  const renderProNotif = () => {
    if (!user) return;
    if (user.plan === "basic" && data.length === 1) {
      return (
        <p className="text-sm text-gray-400 text-right mt-3 mr-5">
          Upgrade ke Pro jika ingin menambah toko baru
        </p>
      );
    }
  };

  return (
    <>
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
        <h1 className="font-semibold text-hitampudar">Toko</h1>
        {renderAddStoreButton()}
      </div>
      {renderToko()}
      {renderProNotif()}
    </>
  );
}
