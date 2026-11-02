import { createContext, useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import axios from "axios";
import api from "../api/axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const url = "https://localhost:7203";
  const { token } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [cart, setCart] = useState({ cartItems: [] });
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [voucherCode, setVoucherCode] = useState("");
  const [voucher, setVoucher] = useState(null);
  const [cartLoaded, setCartLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [minAvailablePrice, setMinAvailablePrice] = useState(0);
  const [maxAvailablePrice, setMaxAvailablePrice] = useState(0);

  const [currentSort, setCurrentSort] = useState("None");
  const [currentMinPrice, setCurrentMinPrice] = useState(null);
  const [currentMaxPrice, setCurrentMaxPrice] = useState(null);
  const [currentCategories, setCurrentCategories] = useState([]);
  const [currentSizes, setCurrentSizes] = useState([]);
  const [currentColors, setCurrentColors] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [allColors, setAllColors] = useState([]);
  const [currentOnlyDiscount, setCurrentOnlyDiscount] = useState(false);

  const fetchProductList = async (
    sort = currentSort,
    loadMore = false,
    minPriceFilter = currentMinPrice,
    maxPriceFilter = currentMaxPrice,
    categories = currentCategories,
    sizes = currentSizes,
    colors = currentColors,
    onlyDiscount = currentOnlyDiscount,
  ) => {
    try {
      setLoading(true);
      const nextPage = loadMore ? page + 1 : 1;

      const response = await axios.get(`${url}/api/product`, {
        params: {
          page: nextPage,
          pageSize: 12,
          sort,
          minPrice: minPriceFilter,
          maxPrice: maxPriceFilter,
          categories,
          sizes,
          colors,
          onlyDiscount,
        },
        paramsSerializer: {
          indexes: null,
        },
      });

      const totalCount = response.data.totalCount;
      const newItems = response.data.items;

      setProducts((prev) => (loadMore ? [...prev, ...newItems] : newItems));

      setMinAvailablePrice(response.data.minPrice);
      setMaxAvailablePrice(response.data.maxPrice);

      const totalLoaded = loadMore
        ? products.length + newItems.length
        : newItems.length;

      setHasMore(totalLoaded < totalCount);

      console.log("Fetched products:", response.data);
      setPage(nextPage);
      setError("");

      setCurrentSort(sort);
      setCurrentMinPrice(minPriceFilter);
      setCurrentMaxPrice(maxPriceFilter);
      setCurrentCategories(categories);
      setCurrentSizes(sizes);
      setCurrentColors(colors);
      setCurrentOnlyDiscount(onlyDiscount);
    } catch (err) {
      console.error(err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const updateProductRatingInState = (productId, updatedSummary) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? {
              ...product,
              averageRating: Number(
                updatedSummary.averageRating ?? product.averageRating ?? 0,
              ),
              ratingsCount: Number(
                updatedSummary.ratingsCount ?? product.ratingsCount ?? 0,
              ),
            }
          : product,
      ),
    );
  };

  const fetchCategories = async () => {
    const res = await axios.get(`${url}/api/category`);
    setAllCategories(res.data);
  };

  const fetchColors = async () => {
    const res = await axios.get(`${url}/api/product/colors`);
    setAllColors(res.data);
    console.log("Fetched colors:", res.data);
  };

  const applyVoucher = async (code) => {
    const normalized = (code || "").trim().toUpperCase();
    if (!normalized) {
      throw new Error("Voucher code is empty");
    }

    const res = await api.post("/voucher/validate", {
      voucherCode: normalized,
    });

    setVoucher(res.data.voucher);
    setVoucherCode(normalized);
    localStorage.setItem("voucherCode", normalized);

    return res.data.voucher;
  };

  const clearVoucher = () => {
    setVoucher(null);
    setVoucherCode("");
    localStorage.removeItem("voucherCode");
  };

  useEffect(() => {
    const savedCode = localStorage.getItem("voucherCode");

    if (savedCode) {
      setVoucherCode(savedCode);
    }

    async function loadData() {
      await fetchCategories();
      await fetchColors();
    }
    loadData();
  }, []);

  useEffect(() => {
    if (!cartLoaded) return;
    if (cartItems.length === 0) {
      clearVoucher();
    }
  }, [cartItems.length, cartLoaded]);

  useEffect(() => {
    if (!token) {
      clearVoucher();
      return;
    }

    const fetchCart = async () => {
      await loadCartData(token);
    };

    const tryValidateSavedVoucher = async () => {
      const savedCode = localStorage.getItem("voucherCode");
      if (!savedCode) return;

      try {
        const res = await api.post("/voucher/validate", {
          voucherCode: savedCode,
        });
        setVoucher(res.data.voucher);
        setVoucherCode(savedCode);
      } catch (err) {
        clearVoucher();
      }
    };

    fetchCart();
    tryValidateSavedVoucher();
  }, [token]);

  const loadCartData = async (token) => {
    const response = await api.get(url + "/api/cart", {});

    setCart(response.data);
    setCartItems(response.data.cartItems);
    setCartLoaded(true);
    console.log("Fetched cart data:", response.data.cartItems);
    console.log("Fetched cart:", response.data);
  };

  const refreshCart = async () => {
    try {
      const response = await api.get(url + "/api/cart");
      setCart(response.data);
    } catch (err) {
      console.error("Failed to refresh cart", err);
    }
  };

  useEffect(() => {
    console.log("✅ Cart items updated:", cartItems);
  }, [cartItems]);

  const addToCart = async (product, quantity = 1) => {
    try {
      const res = await api.post("/cart/addItems", {
        productId: product.id,
        quantity: quantity,
      });
      console.log("Added to cart:", res.data);
      setCartItems(res.data.cartItems);
      await refreshCart();
    } catch (err) {
      console.error("Failed to add to cart", err);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await api.delete(`/cart/items/${itemId}`);
      setCartItems((prev) => prev.filter((item) => item.id !== itemId));
      await refreshCart();
    } catch (err) {
      console.error("Failed to remove item", err);
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      const res = await api.put(`/cart/items/${itemId}`, { quantity });
      setCartItems(res.data.cartItems);
      await refreshCart();
    } catch (err) {
      console.error("Failed to update item", err);
    }
  };

  function clearCart() {
    setCartItems([]);
    setCart({ cartItems: [], total: 0 });
  }

  const fetchMoreProducts = () =>
    fetchProductList(
      currentSort,
      true,
      currentMinPrice,
      currentMaxPrice,
      currentCategories,
      currentSizes,
      currentColors,
      currentOnlyDiscount,
    );

  const contextValue = {
    products,
    url,
    loading,
    error,
    cartItems,
    addToCart,
    removeFromCart,
    updateCartItem,
    cart,
    clearCart,
    isProcessingOrder,
    setIsProcessingOrder,
    fetchProductList,
    fetchMoreProducts,
    minAvailablePrice,
    maxAvailablePrice,
    hasMore,
    setCurrentSort,
    setCurrentCategories,
    setCurrentSizes,
    setCurrentColors,
    currentCategories,
    currentSizes,
    currentColors,
    fetchCategories,
    allCategories,
    allColors,
    voucher,
    voucherCode,
    applyVoucher,
    clearVoucher,
    searchTerm,
    setSearchTerm,
    updateProductRatingInState,
    currentOnlyDiscount,
    setCurrentOnlyDiscount,
    currentSort,
    currentMinPrice,
    currentMaxPrice,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
