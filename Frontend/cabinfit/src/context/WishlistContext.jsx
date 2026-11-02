import { createContext, useCallback, useContext, useEffect, useState } from "react";
import api from "../api/axios";
import AuthContext from "./AuthProvider";
import Swal from "sweetalert2";

export const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { token, user } = useContext(AuthContext);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!token) {
      setWishlistItems([]);
      return;
    }

    try {
      setWishlistLoading(true);
      const res = await api.get("/wishlist");
      setWishlistItems(res.data || []);
    } catch (err) {
      console.error("Failed to fetch wishlist", err);
      setWishlistItems([]);
    } finally {
      setWishlistLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.productId === productId);
  };

  const addToWishlist = async (productId) => {
    if (!token) {
      Swal.fire({
        icon: "info",
        title: "Please sign in",
        text: "You need to sign in to save products to your wishlist.",
        confirmButtonColor: "#111",
      });
      return null;
    }

    try {
      const res = await api.post(`/wishlist/${productId}`);
      setWishlistItems((prev) => [res.data, ...prev]);
      return res.data;
    } catch (err) {
      console.error("Failed to add to wishlist", err);

      const message =
        err.response?.data?.message || "Failed to add item to wishlist.";

      Swal.fire({
        icon: "error",
        title: "Wishlist",
        text: message,
        confirmButtonColor: "#111",
      });

      return null;
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const res = await api.delete(`/wishlist/${productId}`);
      setWishlistItems((prev) =>
        prev.filter((item) => item.productId !== productId)
      );
      return res.data;
    } catch (err) {
      console.error("Failed to remove from wishlist", err);

      const message =
        err.response?.data?.message || "Failed to remove item from wishlist.";

      Swal.fire({
        icon: "error",
        title: "Wishlist",
        text: message,
        confirmButtonColor: "#111",
      });

      return null;
    }
  };

  const toggleWishlist = async (product) => {
    if (!product) return null;

    if (isInWishlist(product.id)) {
      return await removeFromWishlist(product.id);
    }

    return await addToWishlist(product.id);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistLoading,
        wishlistCount: wishlistItems.length,
        fetchWishlist,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}