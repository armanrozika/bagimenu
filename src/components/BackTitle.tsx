import { Link } from "@tanstack/react-router";
import { IoChevronBack } from "react-icons/io5";

function BackTitle({ title, backTo }: { title: string; backTo: string }) {
  return (
    <div className="flex items-center pb-5 mb-5 border-b border-gray-100">
      <Link
        to={backTo}
        className="flex items-center px-4 py-1 text-sm transition rounded-full cursor-pointer hover:bg-gray-100 w-fit"
      >
        <IoChevronBack />
        <h1 className="ml-1">Back</h1>
      </Link>
      <h1 className="ml-5 text-sm font-semibold text-main">{title}</h1>
    </div>
  );
}

export default BackTitle;
