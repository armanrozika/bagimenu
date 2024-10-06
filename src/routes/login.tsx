import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import Icon from "../components/Icon";
import { FcGoogle } from "react-icons/fc";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  enum RegisterType {
    Login,
    Signup,
  }
  const [registerState, setRegisterState] = useState<RegisterType>(
    RegisterType.Login
  );
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <form className="mx-auto my-0 border-2 border-gray-100 p-10 rounded-2xl">
        <Icon />
        <h1 className="text-center mb-10 text-xl text-ungu text-opacity-80 font-semibold">
          BagiMenu
        </h1>
        <div className="relative mb-3">
          <input
            className="border border-gray-200 rounded-lg p-4 w-[300px]"
            type="text"
            placeholder="Email"
            required
          />
        </div>
        <div className="relative">
          <input
            className="border w-full border-gray-200 rounded-lg p-4"
            type="password"
            placeholder="Password"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-ungu mt-5 w-full rounded py-3 font-semibold text-white hover:bg-opacity-95 transition"
        >
          {registerState === RegisterType.Login ? "Masuk" : "Daftar"}
        </button>

        {registerState === RegisterType.Login && (
          <Link
            to=""
            target="_blank"
            className="text-ungu text-right inline-block mt-3 underline"
          >
            Lupa password
          </Link>
        )}
        <div className="text-center mt-7">
          <p className="text-hitampudar text-sm">Masuk dengan Google</p>
          <button
            type="button"
            className="mt-3 rounded-md hover:bg-gray-100 transition border border-gray-300 px-10 py-2"
          >
            <FcGoogle className="mx-auto text-2xl" />
          </button>
        </div>
      </form>
      {registerState === RegisterType.Login && (
        <>
          <div className="flex justify-end items-center mt-5">
            <p className="mr-2 text-hitampudar">Belum punya akun?</p>
            <p
              className="text-ungu cursor-pointer"
              onClick={() => setRegisterState(RegisterType.Signup)}
            >
              Daftar
            </p>
          </div>
        </>
      )}
      {registerState === RegisterType.Signup && (
        <div className="flex justify-center items-center mt-10">
          <p className="mr-2 text-hitampudar">Sudah punya akun?</p>
          <p
            className="text-ungu cursor-pointer"
            onClick={() => setRegisterState(RegisterType.Login)}
          >
            Masuk
          </p>
        </div>
      )}
    </div>
  );
}
