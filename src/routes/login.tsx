import {
  createFileRoute,
  Link,
  Navigate,
  useNavigate,
} from "@tanstack/react-router";
import Icon from "../components/Icon";
import { FcGoogle } from "react-icons/fc";
import { useAuthUser } from "../mutations/useAuthUser";
import { SpinnerPurple, SpinnerWhite } from "../assets";
import { useUser } from "@clerk/clerk-react";
import { useGoogleAuth } from "../mutations/useGoogleAuth";

type Filter = {
  register?: string;
};

export const Route = createFileRoute("/login")({
  component: Login,
  validateSearch: (search): Filter => {
    return {
      register: (search.register as string) || "login",
    };
  },
});

function Login() {
  const navigate = useNavigate({ from: Route.fullPath });
  const { register } = Route.useSearch();

  const { handleSigninGoogle } = useGoogleAuth();

  const { registerForm, submitData } = useAuthUser(register as string);
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <img src={SpinnerPurple} className="w-[30px]" />
      </div>
    );
  }

  if (isSignedIn) {
    return <Navigate to={"/stores"} />;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <form
        onSubmit={registerForm.handleSubmit(submitData)}
        className="block p-5 lg:p-10 mx-auto my-0 border-2 border-gray-100 rounded-2xl"
      >
        <div className="text-center w-fit mb-2 mx-auto">
          <Icon />
        </div>
        <h1 className="mb-10 text-xl font-semibold text-center text-ungu text-opacity-80">
          BagiMenu
        </h1>
        <div className="relative mb-3">
          <input
            {...registerForm.register("emailAddress")}
            className="border border-gray-200 rounded-lg p-4 w-[300px]"
            type="text"
            placeholder="Email"
            required
          />
        </div>
        <div className="relative">
          <input
            {...registerForm.register("password")}
            className="w-full p-4 border border-gray-200 rounded-lg"
            type="password"
            placeholder="Password"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full h-[45px] mt-5 font-semibold text-sm text-white transition rounded bg-ungu hover:bg-opacity-95 block"
        >
          {register === "login" ? (
            registerForm.formState.isSubmitting ? (
              <img src={SpinnerWhite} className="w-[25px]  mx-auto" />
            ) : (
              "Masuk"
            )
          ) : registerForm.formState.isSubmitting ? (
            <img src={SpinnerWhite} className="w-[25px] mx-auto" />
          ) : (
            "Daftar"
          )}
        </button>

        {register === "login" && (
          <Link
            to=""
            target="_blank"
            className="inline-block mt-3 text-right underline text-ungu"
            activeProps={{
              style: {
                backgroundColor: "#ffffff",
              },
            }}
          >
            Lupa password
          </Link>
        )}
        <div className="text-center mt-7">
          <p className="text-sm text-hitampudar">Masuk dengan Google</p>
          <button
            type="button"
            className="px-10 py-2 mt-3 transition border border-gray-300 rounded-md hover:bg-gray-100"
            onClick={() => {
              handleSigninGoogle("oauth_google");
            }}
          >
            <FcGoogle className="mx-auto text-2xl" />
          </button>
        </div>
      </form>
      {register === "login" && (
        <>
          <div className="flex items-center justify-end mt-5">
            <p className="mr-2 text-hitampudar">Belum punya akun?</p>
            <p
              className="cursor-pointer text-ungu"
              onClick={() => {
                navigate({
                  search: (prev) => ({ ...prev, register: "signup" }),
                });
              }}
            >
              Daftar
            </p>
          </div>
        </>
      )}
      {register === "signup" && (
        <div className="flex items-center justify-center mt-10">
          <p className="mr-2 text-hitampudar">Sudah punya akun?</p>
          <p
            className="cursor-pointer text-ungu"
            onClick={() => {
              navigate({
                search: (prev) => ({ ...prev, register: "login" }),
              });
            }}
          >
            Masuk
          </p>
        </div>
      )}
    </div>
  );
}
