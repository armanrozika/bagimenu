import { Link } from "@tanstack/react-router";
import { GrAppsRounded } from "react-icons/gr";
import { AiOutlineProduct, AiOutlineShop } from "react-icons/ai";
import { LiaSignOutAltSolid } from "react-icons/lia";
import { TfiClose } from "react-icons/tfi";
import { BsCart2 } from "react-icons/bs";
import { IoAnalytics } from "react-icons/io5";
import Icon from "./Icon";
import Select from "react-select";
import { useClerk } from "@clerk/clerk-react";
import { GoChecklist } from "react-icons/go";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

function Sidebar({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { signOut } = useClerk();
  const stores = useQuery(api.stores.getStoresWithDefault);
  const updateDefaultStore = useMutation(api.stores.updateDefaultStore);

  const renderSelect = () => {
    if (stores === "basic") return;
    if (!stores || stores.length < 1) return;
    const value = stores.find((store) => store.is_default === true);
    return (
      <Select
        className="my-5 text-sm"
        options={stores}
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
    <div
      className={`min-w-[90%] lg:min-w-[280px] bg-white z-20 fixed top-0 lg:static ${isOpen ? "left-0" : "-left-full"} border-r border-gray-100 h-screen flex flex-col p-6 duration-300 ease-in-out`}
    >
      <TfiClose
        className="absolute lg:hidden top-5 right-5"
        onClick={() => setIsOpen(false)}
      />
      <Icon />
      {renderSelect()}
      <Link
        className="flex items-center p-3 mb-1 text-sm font-semibold transition rounded-md text-hitampudar hover:bg-ungupudar hover:text-ungu"
        to="/dashboard"
        onClick={() => setIsOpen(false)}
      >
        <GrAppsRounded className="mr-3 text-xl" />
        Dashboard
      </Link>

      <div className="pt-5 border-t border-gray-100">
        <Link
          to="/orders"
          className="relative flex items-center p-3 mb-1 text-sm font-semibold transition rounded-md text-hitampudar hover:bg-ungupudar hover:text-ungu"
          onClick={() => setIsOpen(false)}
        >
          <div className="absolute flex items-center justify-center px-3 -translate-y-1/2 rounded-full top-1/2 right-3">
            <p className="text-xs text-ungu">24</p>
          </div>
          <BsCart2 className="mr-3 text-xl" />
          Order
        </Link>

        <Link
          to="/products"
          className="flex items-center p-3 mb-1 text-sm font-semibold transition rounded-md text-hitampudar hover:bg-ungupudar hover:text-ungu"
          onClick={() => setIsOpen(false)}
        >
          <AiOutlineProduct className="mr-3 text-xl" />
          Produk
        </Link>

        <Link
          to="/analytics"
          className="flex items-center p-3 mb-1 text-sm font-semibold transition rounded-md text-hitampudar hover:bg-ungupudar hover:text-ungu"
          onClick={() => setIsOpen(false)}
        >
          <IoAnalytics className="mr-3 text-xl" />
          Analytics
        </Link>
      </div>

      <div className="pt-5 mt-5 border-t border-gray-100">
        <Link
          to="/stores"
          className="flex items-center p-3 mb-1 text-sm font-semibold transition rounded-md cursor-pointer text-hitampudar hover:bg-ungupudar hover:text-ungu"
          onClick={() => setIsOpen(false)}
        >
          <AiOutlineShop className="mr-3 text-xl" />
          <p>Toko</p>
        </Link>
        <Link
          to="/categories"
          className="flex items-center p-3 mb-1 text-sm font-semibold transition rounded-md cursor-pointer text-hitampudar hover:bg-ungupudar hover:text-ungu"
          onClick={() => setIsOpen(false)}
        >
          <GoChecklist className="mr-3 text-xl" />
          <p>Kategori</p>
        </Link>

        <div
          className="flex items-center p-3 mb-1 text-sm font-semibold transition rounded-md cursor-pointer text-hitampudar hover:bg-ungupudar hover:text-ungu"
          onClick={() => {
            signOut({
              redirectUrl: "/login",
            });
          }}
        >
          <LiaSignOutAltSolid className="mr-3 text-xl" />
          <p>Logout</p>
        </div>
      </div>

      <div className="absolute left-5 bottom-20  text-sm p-7 rounded-2xl border border-gray-200 w-[240px] mx-auto">
        <p className="text-hitampudar">
          Pakai domain sendiri biar lebih keren!
        </p>
        <button className="w-full py-2 mt-3 text-sm text-white bg-ungu">
          Upgrade Pro
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
