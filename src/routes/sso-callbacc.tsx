import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect } from "react";

export const Route = createFileRoute("/sso-callbacc")({
  component: NavigatorPage,
});
function NavigatorPage() {
  const navigate = useNavigate();
  const addUser = useMutation(api.users.add);
  useEffect(() => {
    const fetch = async () => {
      const user = await addUser();
      if (user) {
        navigate({ to: "/dashboard" });
      }
    };

    fetch();
  }, []);

  return <p>Loading...</p>;
}
