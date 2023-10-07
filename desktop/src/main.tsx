import { createRoot } from "react-dom/client";
import {
  Outlet,
  RootRoute,
  Route,
  Router,
  RouterProvider,
  redirect,
} from "@tanstack/react-router";

import "./main.css";

import { Welcome } from "@/pages/Welcome";

const Root = () => {
  return <Outlet />;
};

const rootRoute = new RootRoute({
  component: Root,
});

const indexRoute = new Route({
  beforeLoad: () => {
    const isInitialized = localStorage.getItem("profiles");
    console.log("IS", isInitialized);
    if (!isInitialized) throw redirect({ to: "/welcome" });
  },
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <h1>Index page</h1>,
});

const welcomeRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/welcome",
  component: Welcome,
});

const routeTree = rootRoute.addChildren([indexRoute, welcomeRoute]);

const router = new Router({ routeTree });

const root = createRoot(document.getElementById("root")!);
root.render(<RouterProvider router={router} />);
