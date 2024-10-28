import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import Sidebar from "../components/Sidebar";
import { CiMenuFries } from "react-icons/ci";
import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { SpinnerPurple } from "../assets";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { IoStorefrontOutline } from "react-icons/io5";

export const Route = createFileRoute("/_private")({
  component: PrivateWrapper,
});

function PrivateWrapper() {
  const { isSignedIn, isLoaded } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const defaultStore = useQuery(api.stores.defaultStore);

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <img src={SpinnerPurple} className="w-[30px]" />
      </div>
    );
  }
  if (isSignedIn) {
    return (
      <div className="flex bg-[#f7f7f7] min-h-[100vh]">
        <div
          className="fixed flex items-center justify-between z-10 w-full p-4 bg-white border-b border-gray-100 lg:hidden top- left-0"
          onClick={() => setIsOpen(true)}
        >
          <CiMenuFries />
          <p>{defaultStore?.name}</p>
        </div>
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
        <div className="w-full">
          <div className="bg-ungu text-white p-3 font-semibold flex items-center min-h-[48px]">
            <IoStorefrontOutline className="mr-2 text-xl" />
            <p>{defaultStore?.name}</p>
          </div>

          <div className="p-5 lg:p-16 max-w-[1200px] mx-auto">
            <div className="bg-white p-5 lg:p-10 rounded-3xl lg:mt-0">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <Navigate to={"/login"} />;
}
