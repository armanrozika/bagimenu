import { useSignIn, useSignUp } from "@clerk/clerk-react";
import { OAuthStrategy } from "@clerk/types";

export const useGoogleAuth = () => {
  const { signIn } = useSignIn();
  const { signUp, setActive } = useSignUp();

  const signInWith = (strategy: OAuthStrategy) => {
    return signIn?.authenticateWithRedirect({
      strategy,
      redirectUrl: "/sso-callback",
      //redirect to diff url to register user to convex db
      //no idea how to read the session without doing this way
      redirectUrlComplete: "/sso-callbacc",
    });
  };

  const handleSigninGoogle = async (strategy: OAuthStrategy) => {
    //user have account: email/pass already, but attempt to use OAuth
    const userExistsButNeedsToSignIn =
      signUp?.verifications.externalAccount.status === "transferable" &&
      signUp?.verifications.externalAccount.error?.code ===
        "external_account_exists";

    if (userExistsButNeedsToSignIn) {
      const res = await signIn?.create({ transfer: true });

      if (res?.status === "complete" && setActive) {
        setActive({
          session: res.createdSessionId,
        });
      }
    } else {
      signInWith(strategy);
    }
  };

  return { handleSigninGoogle };
};
