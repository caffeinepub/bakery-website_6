import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import Footer from "./components/layout/Footer";
import Navigation from "./components/layout/Navigation";
import AdminPanelPage from "./pages/AdminPanelPage";
import HomePage from "./pages/HomePage";
import MenuPage from "./pages/MenuPage";
import RewardsPage from "./pages/RewardsPage";
import VotePage from "./pages/VotePage";

function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

const rootRoute = createRootRoute({ component: Layout });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const menuRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/menu",
  component: MenuPage,
});

const rewardsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/rewards",
  component: RewardsPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPanelPage,
});

const voteRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/vote",
  component: VotePage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  menuRoute,
  rewardsRoute,
  adminRoute,
  voteRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" />
    </ThemeProvider>
  );
}
