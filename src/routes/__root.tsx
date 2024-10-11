import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Toaster } from "react-hot-toast";

export const Route = createRootRoute({
  component: () => (
    <React.Fragment>
      <Outlet />
      <Toaster />
    </React.Fragment>
  ),
});
