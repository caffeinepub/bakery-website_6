import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import Navigation from './components/layout/Navigation';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import RewardsPage from './pages/RewardsPage';
import AdminPanelPage from './pages/AdminPanelPage';

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
  path: '/',
  component: HomePage,
});

const menuRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/menu',
  component: MenuPage,
});

const rewardsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/rewards',
  component: RewardsPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminPanelPage,
});

const routeTree = rootRoute.addChildren([indexRoute, menuRoute, rewardsRoute, adminRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
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
