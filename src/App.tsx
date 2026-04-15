import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";
import Index from "./pages/Index";
import Catalog from "./pages/Catalog";
import ProductPage from "./pages/ProductPage";
import Checkout from "./pages/Checkout";
import About from "./pages/About";
import Delivery from "./pages/Delivery";
import Contacts from "./pages/Contacts";
import Favorites from "./pages/Favorites";
import Profile from "./pages/Profile";
import Offer from "./pages/Offer";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import PaymentSecurity from "./pages/PaymentSecurity";
import NotFound from "./pages/NotFound";
import CookieBanner from "./components/CookieBanner";
import { lazy, Suspense } from "react";

const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminInventory = lazy(() => import("./pages/admin/AdminInventory"));
const AdminCustomers = lazy(() => import("./pages/admin/AdminCustomers"));
const AdminReturns = lazy(() => import("./pages/admin/AdminReturns"));
const AdminAnalytics = lazy(() => import("./pages/admin/AdminAnalytics"));

const queryClient = new QueryClient();

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <FavoritesProvider>
          <Toaster />
          <Sonner />
            <BrowserRouter>
            <ScrollToTop />
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Загрузка...</div>}>
              <Routes>
                {/* Admin routes - no header/footer */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={null} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="inventory" element={<AdminInventory />} />
                  <Route path="customers" element={<AdminCustomers />} />
                  <Route path="returns" element={<AdminReturns />} />
                  <Route path="analytics" element={<AdminAnalytics />} />
                </Route>

                {/* Shop routes */}
                <Route path="*" element={
                  <>
                    <Header />
                    <main className="min-h-screen">
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/catalog" element={<Catalog />} />
                        <Route path="/product/:id" element={<ProductPage />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/delivery" element={<Delivery />} />
                        <Route path="/contacts" element={<Contacts />} />
                        <Route path="/offer" element={<Offer />} />
                        <Route path="/privacy" element={<Privacy />} />
                        <Route path="/terms" element={<Terms />} />
                        <Route path="/payment-security" element={<PaymentSecurity />} />
                        <Route path="/favorites" element={<Favorites />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>
                    <Footer />
                    <CartDrawer />
                    <CookieBanner />
                  </>
                } />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </FavoritesProvider>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
