import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import Layout from "./components/Layout.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import { Protected, AdminOnly } from "./components/Guards.jsx";
import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import Orders from "./pages/Orders.jsx";
import OrderDetail from "./pages/OrderDetail.jsx";
import OrderSuccess from "./pages/OrderSuccess.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Account from "./pages/Account.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import About from "./pages/About.jsx";
import Faq from "./pages/Faq.jsx";
import NotFound from "./pages/NotFound.jsx";
import { Privacy, Terms, Refunds, Shipping, Contact } from "./pages/Legal.jsx";
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import ProductsAdmin from "./pages/admin/Products.jsx";
import Inventory from "./pages/admin/Inventory.jsx";
import OrdersAdmin from "./pages/admin/Orders.jsx";
import CouponsAdmin from "./pages/admin/Coupons.jsx";
import CmsAdmin from "./pages/admin/Cms.jsx";
import ReviewsAdmin from "./pages/admin/Reviews.jsx";
import SupportAdmin from "./pages/admin/Support.jsx";
import Reports from "./pages/admin/Reports.jsx";
import Settings from "./pages/admin/Settings.jsx";
import UsersAdmin from "./pages/admin/Users.jsx";

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:pid" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/chat" element={<Navigate to="/contact" replace />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/refunds" element={<Refunds />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<Faq />} />
          <Route element={<Protected />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:oid" element={<OrderDetail />} />
            <Route path="/order-success/:oid" element={<OrderSuccess />} />
            <Route path="/account" element={<Account />} />
          </Route>
          <Route element={<AdminOnly />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<ProductsAdmin />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="orders" element={<OrdersAdmin />} />
              <Route path="coupons" element={<CouponsAdmin />} />
              <Route path="cms" element={<CmsAdmin />} />
              <Route path="reviews" element={<ReviewsAdmin />} />
              <Route path="support" element={<SupportAdmin />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
              <Route path="users" element={<UsersAdmin />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <ToastContainer
        position="bottom-center"
        toastClassName="!rounded-2xl !bg-surface-card !text-text !border-2 !border-accent/30 !shadow-lg"
      />
    </BrowserRouter>
  </AuthProvider>
);

export default App;
