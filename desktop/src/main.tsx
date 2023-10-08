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
import { Wallet } from "@/pages/Wallet";
import { NewProfile } from "@/pages/NewProfile";

const Root = () => {
  return <Outlet />;
};

const rootRoute = new RootRoute({
  component: Root,
});

const indexRoute = new Route({
  beforeLoad: () => {
    const isInitialized = localStorage.getItem("profiles");
    if (!isInitialized) throw redirect({ to: "/welcome" });
  },
  getParentRoute: () => rootRoute,
  path: "/",
  component: Wallet,
});

const welcomeRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/welcome",
  component: Welcome,
});

const newProfileRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/profile/new",
  component: NewProfile,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  welcomeRoute,
  newProfileRoute,
]);

const router = new Router({ routeTree });

const root = createRoot(document.getElementById("root")!);
root.render(<RouterProvider router={router} />);
