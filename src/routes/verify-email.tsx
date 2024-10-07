import { useSignUp } from "@clerk/clerk-react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/verify-email")({
  component: VerifyEmail,
});

function VerifyEmail() {
  const navigate = useNavigate();
  const { isLoaded, signUp, setActive } = useSignUp();
  const [code, setCode] = useState("");
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === "complete") {
        setActive &&
          (await setActive({ session: signUpAttempt.createdSessionId }));
        navigate({ to: "/dashboard" });
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error("Error:", JSON.stringify(err, null, 2));
    }
  };
  return (
    <div>
      <p>Masukkan code yang anda terima di email anda</p>
      <form onSubmit={handleVerify}>
        <input
          type="text"
          placeholder="enter the code"
          onChange={(e) => setCode(e.target.value)}
        />
      </form>
    </div>
  );
}
