import { useAuth, useSignIn } from "@clerk/clerk-react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

export const Route = createFileRoute("/reset-password")({
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const { isLoaded, signIn, setActive } = useSignIn();
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const form = useForm<{ email: string }>();
  const submitEmail: SubmitHandler<{ email: string }> = async (formData) => {
    await signIn
      ?.create({
        strategy: "reset_password_email_code",
        identifier: formData.email,
      })
      .then((_) => {
        setSuccessfulCreation(true);
      })
      .catch((err) => {
        console.error("error", err.errors[0].longMessage);
        toast.error(err.errors[0].longMessage);
      });
  };

  const formReset = useForm<{ code: string; password: string }>();
  const submitReset: SubmitHandler<{ code: string; password: string }> = async (
    formData
  ) => {
    await signIn
      ?.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: formData.code,
        password: formData.password,
      })
      .then((result) => {
        setActive({ session: result.createdSessionId });
      })
      .catch((err) => {
        console.error("error", err.errors[0].longMessage);
        toast.error(err.errors[0].longMessage);
      });
  };

  if (!isLoaded) {
    return <></>;
  }

  if (isSignedIn) {
    navigate({ to: "/stores" });
  }

  return (
    <div>
      {!successfulCreation && (
        <form
          onSubmit={form.handleSubmit(submitEmail)}
          className="w-[300px] mx-auto mt-10"
        >
          <p className="mb-2">Isi alamat email Anda: </p>
          <input
            {...form.register("email")}
            type="email"
            required
            placeholder="Email"
            className="p-3 bg-gray-100 rounded-lg w-full mb-5"
          />

          <button
            type="submit"
            className="bg-ungu text-white px-8 py-2 rounded w-full font-semibold"
          >
            {form.formState.isSubmitting ? "Mengirim..." : "Kirim"}
          </button>
        </form>
      )}

      {successfulCreation && (
        <form
          onSubmit={formReset.handleSubmit(submitReset)}
          className="w-[300px] mx-auto mt-10"
        >
          <p className="mb-2">Masukkan kode yang Anda terima di email Anda: </p>
          <input
            {...formReset.register("code")}
            type="text"
            required
            placeholder="Kode"
            className="p-3 bg-gray-100 rounded-lg w-full mb-5"
          />
          <p className="mb-2">Silakan masukkan password baru Anda: </p>
          <input
            {...formReset.register("password")}
            type="password"
            required
            placeholder="Password"
            className="p-3 bg-gray-100 rounded-lg w-full mb-5"
          />

          <button
            type="submit"
            className="bg-ungu text-white px-8 py-2 rounded w-full font-semibold"
          >
            {formReset.formState.isSubmitting ? "Mengirim..." : "Kirim"}
          </button>
        </form>
      )}
    </div>
  );
}
