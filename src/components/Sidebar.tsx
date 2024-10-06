import { Link } from "@tanstack/react-router";
import { GrAppsRounded } from "react-icons/gr";
import { AiOutlineProduct, AiOutlineShop } from "react-icons/ai";
import { LiaSignOutAltSolid } from "react-icons/lia";
import { TfiClose } from "react-icons/tfi";
import { BsCart2 } from "react-icons/bs";
import { IoAnalytics } from "react-icons/io5";
import Icon from "./Icon";

function Sidebar({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div
      className={`min-w-[90%] lg:min-w-[280px] bg-white z-20 fixed top-0 lg:static ${isOpen ? "left-0" : "-left-full"} border-r border-gray-100 h-screen flex flex-col p-6 duration-300 ease-in-out`}
    >
      <TfiClose
        className="lg:hidden absolute top-5 right-5"
        onClick={() => setIsOpen(false)}
      />
      <Icon />
      <Link
        className="transition mb-1 mt-10 rounded p-3 text-ungu text-sm bg-ungupudar flex items-center font-semibold"
        to=""
        onClick={() => setIsOpen(false)}
      >
        <GrAppsRounded className="mr-3 text-xl text-ungu" />
        Dashboard
      </Link>

      <div className="border-t border-gray-100 mt-5 pt-5">
        <Link
          to=""
          className="relative transition mb-1 rounded p-3 text-sm text-hitampudar flex items-center font-semibold"
          onClick={() => setIsOpen(false)}
        >
          <div className="px-3  rounded-full top-1/2 -translate-y-1/2 right-3 absolute flex items-center justify-center">
            <p className="text-ungu text-xs">24</p>
          </div>
          <BsCart2 className="mr-3 text-xl" />
          Orders
        </Link>

        <Link
          to=""
          className="transition mb-1 rounded-md p-3 text-sm text-hitampudar flex items-center font-semibold"
          onClick={() => setIsOpen(false)}
        >
          <AiOutlineProduct className="mr-3 text-xl" />
          Products
        </Link>

        <Link
          to=""
          className="transition mb-1 rounded-md p-3 text-sm text-hitampudar flex items-center font-semibold"
          onClick={() => setIsOpen(false)}
        >
          <IoAnalytics className="mr-3 text-xl" />
          Analytics
        </Link>
      </div>

      <div className="border-t border-gray-100 mt-5 pt-5">
        <Link
          to=""
          className="transition mb-1  rounded-md p-3 text-sm text-hitampudar flex items-center font-semibold cursor-pointer"
          onClick={() => setIsOpen(false)}
        >
          <AiOutlineShop className="mr-3 text-xl" />
          <p>Toko</p>
        </Link>

        <div className="transition mb-1  rounded-md p-3 text-sm text-hitampudar flex items-center font-semibold cursor-pointer">
          <LiaSignOutAltSolid className="mr-3 text-xl" />
          <p>Logout</p>
        </div>
      </div>

      <div className="absolute left-5 bottom-20  text-sm p-7 rounded-2xl border border-gray-200 w-[240px] mx-auto">
        <p className="text-hitampudar">
          Pakai domain sendiri, jadi lebih keren!
        </p>
        <button className="bg-ungu text-white text-sm w-full mt-3 py-2">
          Beli domain
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
