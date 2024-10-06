import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import Sidebar from "../components/Sidebar";
import { CiMenuFries } from "react-icons/ci";
import { useState } from "react";

export const Route = createFileRoute("/_private")({
  component: PrivateWrapper,
});

function PrivateWrapper() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex">
      <div
        className="lg:hidden fixed p-4 border-b border-gray-100 w-full top- lef-0 bg-white z-10"
        onClick={() => setIsOpen(true)}
      >
        <CiMenuFries />
      </div>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="p-5 lg:p-16 w-full">
        <div className="border border-gray-200 p-5 lg:p-10 rounded-3xl mt-[50px] lg:mt-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
