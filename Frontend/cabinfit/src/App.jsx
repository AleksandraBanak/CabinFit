import { Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Home from "./pages/Home";
import RegisterPage from "./pages/RegisterPage";
import AuthTestComponent from "./components/AuthTestComponent";
import Navbar from "./components/Navbar/Navbar";
import Products from "./pages/Products";
import CartPage from "./pages/Cart";
import ProductDetailsPage from "./pages/ProductDetails";
import CheckOutPage from "./pages/CheckOutPage";
import SuccessPage from "./pages/SuccessPage";
import ProfilePage from "./pages/ProfilePage";
import OrdersPage from "./pages/OrdersPage";
import OrderDetails from "./components/Order/OrderDetails";
import AddProduct from "./components/AddProduct/AddProduct";
import DriverRoute from "./components/ProtectedRoute/DriverRoute";
import DriverPendingPage from "./components/PendingOrders/PendingOrders";
import DriverMyDeliveriesPage from "./pages/DriverMyDeliveriesPage";
import DriverDeliveredPage from "./pages/DriverDeliveredPage";
import DriverNavbar from "./components/Navbar/DriverNavbar";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import SalePage from "./pages/SalePage";
import AboutUs from "./components/AboutUs/AboutUs";
import WishList from "./pages/WishList";
import SiteFooter from "./components/Footer/SiteFooter";
import ScrollToTop from "./components/UI/ScrollToTop";
import { useContext } from "react";
import { AuthContext } from "./context/AuthProvider";

function App() {
  const { user, loading  } = useContext(AuthContext);

  const roles = user?.roles || user?.Roles || [];
  const isDriver = roles.some((r) => r.toLowerCase() === "driver");

  return (
    <>
      <div className="app">
        <ScrollToTop />
        {isDriver ? <DriverNavbar /> : <Navbar />}
        <Routes>
          <Route
            path="/"
            element={
              isDriver ? <Navigate to="/driver/pending" replace /> : <Home />
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/products" element={<Products />} />
          <Route path="/sale" element={<SalePage />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
          <Route path="/auth-test" element={<AuthTestComponent />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckOutPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/order-details/:id" element={<OrderDetails />} />
          <Route path="/admin/add-product" element={<AddProduct />} />
          <Route path="/products/edit/:id" element={<AddProduct />} />
          <Route path="/wishlist" element={<WishList />} />

          <Route
            path="/driver/pending"
            element={
              <DriverRoute>
                <DriverPendingPage />
              </DriverRoute>
            }
          />

          <Route
            path="/driver/mine"
            element={
              <DriverRoute>
                <DriverMyDeliveriesPage />
              </DriverRoute>
            }
          />

          <Route
            path="/driver/delivered"
            element={
              <DriverRoute>
                <DriverDeliveredPage />
              </DriverRoute>
            }
          />
        </Routes>

        {!isDriver && <SiteFooter />}
      </div>
    </>
  );
}

export default App;
