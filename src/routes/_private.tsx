import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import Sidebar from "../components/Sidebar";
import { CiMenuFries } from "react-icons/ci";
import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { SpinnerPurple } from "../assets";

export const Route = createFileRoute("/_private")({
  component: PrivateWrapper,
});

function PrivateWrapper() {
  const { isSignedIn, isLoaded } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <img src={SpinnerPurple} className="w-[30px]" />
      </div>
    );
  }
  if (isSignedIn) {
    return (
      <div className="flex bg-[#f7f7f7]">
        <div
          className="fixed z-10 w-full p-4 bg-white border-b border-gray-100 lg:hidden top- lef-0"
          onClick={() => setIsOpen(true)}
        >
          <CiMenuFries />
        </div>
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
        <div className="w-full p-5 lg:p-16 max-w-[1200px] mx-auto">
          <div className="bg-white p-5 lg:p-10 rounded-3xl mt-[50px] lg:mt-0">
            <Outlet />
          </div>
        </div>
      </div>
    );
  }

  return <Navigate to={"/login"} />;
}
