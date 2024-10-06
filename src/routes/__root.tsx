import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <React.Fragment>
      <div className="font-bold text-2xl">This is Landing Page</div>
      <Outlet />
    </React.Fragment>
  ),
});
