import { useSignUp, useSignIn } from "@clerk/clerk-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { SignUpType } from "../types/types";
import { useNavigate } from "@tanstack/react-router";
import toast from "react-hot-toast";

export const useAuthUser = (state: string) => {
  const { isLoaded, signUp } = useSignUp();
  const { signIn, setActive } = useSignIn();
  const navigate = useNavigate();

  const registerForm = useForm<SignUpType>();
  const submitData: SubmitHandler<SignUpType> = async (formData) => {
    if (!isLoaded) return;
    try {
      if (state === "signup") {
        if (!setActive) return;
        //user have OAuth, but signup using same email as OAuth
        const userNeedsToBeCreated =
          signIn?.firstFactorVerification.status === "transferable";
        if (userNeedsToBeCreated) {
          const res = await signUp.create({
            transfer: true,
          });

          if (res.status === "complete") {
            await setActive({
              session: res.createdSessionId,
            });
            navigate({ to: "/dashboard" });
          }
        } else {
          //if no OAuth, then proceed signup as per usual
          await signUp?.create(formData);
          await signUp.prepareEmailAddressVerification({
            strategy: "email_code",
          });
          navigate({ to: "/verify-email" });
        }
      }
      if (state === "login") {
        const signInAttempt = await signIn?.create({
          identifier: formData.emailAddress,
          password: formData.password,
        });
        if (signInAttempt?.status === "complete") {
          if (!setActive) return;
          await setActive({ session: signInAttempt.createdSessionId });
          navigate({ to: "/dashboard" });
        } else {
          console.error(JSON.stringify(signInAttempt, null, 2));
        }
      }
    } catch (error) {
      toast.error(JSON.parse(JSON.stringify(error, null, 2)).errors[0].message);
      console.log(JSON.parse(JSON.stringify(error, null, 2)).errors[0].message);
    }
  };

  return { registerForm, submitData };
};
