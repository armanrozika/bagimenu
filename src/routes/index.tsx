import { createFileRoute, Link } from "@tanstack/react-router";
import Icon from "../components/Icon";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="bg-ungu h-[100vh] text-center px-5 flex flex-col justify-center">
      <Link
        className="absolute top-5 right-8 text-white font-semibold text-sm"
        to="/login"
        search={(prev) => ({ ...prev, register: "login" })}
      >
        Login
      </Link>
      <div className="bg-white w-[60px] h-[60px] flex items-center mx-auto mb-2 rounded-full p-3">
        <Icon />
      </div>
      <h1 className="text-white text-2xl font-semibold mb-3">BagiMenu</h1>
      <p className="text-white py-3">
        Cara cepat dan mudah bagikan menu jualanmu
      </p>
      <p className="text-white mb-5 font-semibold">
        Gratis, tanpa biaya apapun!
      </p>
      <div className="flex justify-center items-center text-sm font-semibold text-ungu">
        <Link
          to="/$store_url"
          params={{ store_url: "demo" }}
          className="bg-white px-7 py-2.5 rounded"
        >
          Lihat Demo
        </Link>
        <Link
          to="/login"
          className="bg-white px-7 py-2.5 ml-3 rounded"
          search={(prev) => ({ ...prev, register: "signup" })}
        >
          Daftar
        </Link>
      </div>
    </div>
  );
}
