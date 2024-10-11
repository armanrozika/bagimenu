import { useSignUp, useSignIn } from "@clerk/clerk-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { RegisterType, SignUpType } from "../types/types";
import { useNavigate } from "@tanstack/react-router";
import toast from "react-hot-toast";

export const useAuthUser = (state: RegisterType) => {
  const { isLoaded, signUp } = useSignUp();
  const { signIn, setActive } = useSignIn();
  const navigate = useNavigate();

  const registerForm = useForm<SignUpType>();
  const submitData: SubmitHandler<SignUpType> = async (formData) => {
    if (!isLoaded) return;
    try {
      if (state === RegisterType.Signup) {
        await signUp?.create(formData);
        await signUp.prepareEmailAddressVerification({
          strategy: "email_code",
        });
        navigate({ to: "/verify-email" });
      }
      if (state === RegisterType.Login) {
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
