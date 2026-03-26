import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";

import Index from "./pages/Index";
import Rooms from "./pages/Rooms";
import Booking from "./pages/Booking";
import Restaurant from "./pages/Restaurant";
import Banquet from "./pages/Banquet";
import Reviews from "./pages/Reviews";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminBanquet from "./pages/AdminBanquet";
import AdminRoom from "./pages/AdminRoom";
import AdminMenu from "./pages/AdminMenu";
import AdminReviews from "./pages/AdminReviews";
import AdminRoute from "./routes/AdminRoute";

const queryClient = new QueryClient();

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}
      {children}
      {!isAdminRoute && <ChatWidget />}
      {!isAdminRoute && <Footer />}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <BrowserRouter>
        <LayoutWrapper>

          {/* 🔥 ALL ROUTES MUST BE INSIDE THIS */}
          <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/restaurant" element={<Restaurant />} />
          <Route path="/banquet" element={<Banquet />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/contact" element={<Contact />} />

          {/* ✅ ADMIN LOGIN */}
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* ✅ PROTECTED ADMIN */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          {/* ✅ ADMIN BANQUET */}
          <Route
            path="/admin/banquet"
            element={
              <AdminRoute>
                <AdminBanquet />
              </AdminRoute>
            }
          />

          {/* ✅ ADMIN ROOMS */}
          <Route
            path="/admin/rooms"
            element={
              <AdminRoute>
                <AdminRoom />
              </AdminRoute>
            }
          />

          {/* ✅ ADMIN MENU */}
          <Route
            path="/admin/menu"
            element={
              <AdminRoute>
                <AdminMenu />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/reviews"
            element={
              <AdminRoute>
                <AdminReviews />
              </AdminRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
          </Routes>
        </LayoutWrapper>
      </BrowserRouter>

    </TooltipProvider>
  </QueryClientProvider>
);

export default App;