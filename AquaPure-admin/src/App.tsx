import { Routes, Route, Navigate } from "react-router-dom";
import { AdminProtectedRoute } from "@/components/AdminProtectedRoute";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Products from "@/pages/Products";
import Orders from "@/pages/Orders";
import Customers from "@/pages/Customers";
import Reviews from "@/pages/Reviews";
import Settings from "@/pages/Settings";
import Promotions from "@/pages/Promotions";
import ScrollToTop from "@/components/ScrollToTop";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <AdminProtectedRoute>
            <Dashboard />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/products"
        element={
          <AdminProtectedRoute>
            <Products />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <AdminProtectedRoute>
            <Orders />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/customers"
        element={
          <AdminProtectedRoute>
            <Customers />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/reviews"
        element={
          <AdminProtectedRoute>
            <Reviews />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/promotions"
        element={
          <AdminProtectedRoute>
            <Promotions />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <AdminProtectedRoute>
            <Settings />
          </AdminProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </>
  );
}
