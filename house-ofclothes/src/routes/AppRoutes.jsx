import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";
import Products from "../pages/Products/Products";
import ProductDetails from "../pages/ProductDetails/ProductDetails";
import Cart from "../pages/Cart/Cart";
import Wishlist from "../pages/Wishlist/Wishlist";
import Login from "../pages/Login/Login";
import Signup from "../pages/Signup/Signup";
import Profile from "../pages/Profile/Profile";
import Orders from "../pages/Orders/Orders";
import Checkout from "../pages/Checkout/Checkout";
import NotFound from "../pages/NotFound/NotFound";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
