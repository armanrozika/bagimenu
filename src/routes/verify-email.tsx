import { useSignUp } from "@clerk/clerk-react";
import { useMutation as mutationConvex } from "convex/react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { api } from "../../convex/_generated/api";
import { useMutation } from "@tanstack/react-query";

export const Route = createFileRoute("/verify-email")({
  component: VerifyEmail,
});

function VerifyEmail() {
  const setUser = mutationConvex(api.users.add);
  const navigate = useNavigate();
  const { isLoaded, signUp, setActive } = useSignUp();
  const [code, setCode] = useState("");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    const signUpAttempt = await signUp.attemptEmailAddressVerification({
      code,
    });

    if (signUpAttempt.status === "complete") {
      if (setActive) {
        await setActive({ session: signUpAttempt.createdSessionId });
        const data = await setUser();
        return data;
      }
    } else {
      throw new Error(JSON.stringify(signUpAttempt, null, 2));
    }
  };

  const addUser = useMutation({
    mutationFn: handleVerify,
    onSuccess: () => {
      navigate({ to: "/dashboard" });
    },
  });

  return (
    <div className="mt-20 text-center">
      <p className="mb-7">
        {addUser.isPending
          ? "Menunggu..."
          : "Masukkan code yang anda terima di email anda"}
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addUser.mutate(e);
        }}
      >
        <input
          type="text"
          placeholder="Masukkan kode"
          onChange={(e) => setCode(e.target.value)}
          className="p-3 rounded-lg bg-gray-50"
        />
        <button
          type="submit"
          className="px-5 py-2 ml-2 text-sm font-semibold text-white rounded-lg bg-ungu"
        >
          Kirim
        </button>
      </form>
    </div>
  );
}
