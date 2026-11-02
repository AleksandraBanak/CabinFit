import { useContext, useState, useEffect } from "react";
import { StoreContext } from "../../context/StoreContext";
import ProductItem from "../ProductItem/ProductItem";
import Filters from "../Filters/Filters";
import AuthContext from "../../context/AuthProvider";
import { useSearchParams } from "react-router-dom";
import "./ProductList.css";

function ProductList({ onlyDiscountPage = false }) {
  const {
    products,
    loading,
    error,
    hasMore,
    fetchMoreProducts,
    minAvailablePrice,
    maxAvailablePrice,
    fetchProductList,
    currentSort,
    currentMinPrice,
    currentMaxPrice,
    currentCategories,
    currentSizes,
    currentColors,
  } = useContext(StoreContext);
  const { user } = useContext(AuthContext);

  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [onlyDiscount, setOnlyDiscount] = useState(onlyDiscountPage);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [colors, setColors] = useState([]);
  const [searchParams] = useSearchParams();

  const searchTermParams = searchParams.get("search") || "";
  const normalizedSearch = searchTermParams.trim().toLowerCase();

  const handlePrevImage = (id, imagesLength) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [id]: prev[id] > 0 ? prev[id] - 1 : imagesLength - 1,
    }));
  };

  const handleNextImage = (id, imagesLength) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [id]: prev[id] < imagesLength - 1 ? prev[id] + 1 : 0,
    }));
  };

  useEffect(() => {
    setOnlyDiscount(onlyDiscountPage);

    if (onlyDiscountPage) {
      fetchProductList("None", false, null, null, [], [], [], true);
    } else {
      fetchProductList(
        currentSort,
        false,
        currentMinPrice,
        currentMaxPrice,
        currentCategories,
        currentSizes,
        currentColors,
        false,
      );
    }
  }, [onlyDiscountPage]);

  useEffect(() => {
    const savedPosition = sessionStorage.getItem("productListScrollPos");

    if (!loading && products.length > 0 && savedPosition) {
      window.scrollTo({
        top: savedPosition,
        left: 0,
        behavior: "instant",
      });
      sessionStorage.removeItem("productListScrollPos");
    }
  }, [loading, products]);

  const handleProductClick = () => {
    sessionStorage.setItem("productListScrollPos", window.scrollY.toString());
  };

  const filteredProducts = products
    .filter((p) => {
      if (user?.roles?.includes("admin")) {
        return true;
      }
      return p;
    })
    .filter((p) => !onlyDiscount || p.discountPercentage > 0)
    .filter((p) => {
      if (!normalizedSearch) return true;

      const dimensions = `${p.width}x${p.height}x${p.depth}`
        .replace(/\s/g, "")
        .toLowerCase();
      const cleanSearch = normalizedSearch.replace(/\s/g, "");

      return (
        p.name?.toLowerCase().includes(normalizedSearch) ||
        p.categoryName?.toLowerCase().includes(normalizedSearch) ||
        p.color?.toLowerCase().includes(normalizedSearch) ||
        `${p.width || ""} ${p.height || ""} ${p.depth || ""}`
          .toLowerCase()
          .includes(normalizedSearch) ||
        dimensions.includes(cleanSearch)
      );
    });

  if (error) return <p className="text-danger text-center mt-4">{error}</p>;

  return (
    <>
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}

      <section className="promo-section">
        <div className="promo-overlay text-center text-white">
          <h2>Travel smarter with CabinFit - Perfect size for every airline</h2>
          <h3 className="section-title">Travel Bags & Luggage</h3>
        </div>
      </section>
      <div className="product-div">
        <div className="container mt-4 product-details-container">
          <div className="row">
            <div className="col-12">
              <Filters
                products={products}
                categories={categories}
                setCategories={setCategories}
                sizes={sizes}
                setSizes={setSizes}
                onlyDiscount={onlyDiscount}
                setOnlyDiscount={setOnlyDiscount}
                minAvailablePrice={minAvailablePrice}
                maxAvailablePrice={maxAvailablePrice}
                selectedColors={colors}
                setSelectedColors={setColors}
                user={user}
              />
            </div>
            
            <main className="col-12">
              {filteredProducts.length === 0 && !loading ? (
                <div className="no-results-container">
                  <div className="no-results-breadcrumb">
                    Home
                    {normalizedSearch && (
                      <>
                        <span className="breadcrumb-separator"> / </span>
                        <span>Search for &quot;{searchTermParams}&quot;</span>
                      </>
                    )}
                  </div>

                  <h1 className="no-results-title">SEARCH</h1>

                  <p className="no-results-text">
                    We are sorry, but no results were found for:{" "}
                    <strong>{searchTermParams}</strong>
                  </p>

                  <div className="search-tips-box">
                    <h5>SEARCH TIPS</h5>
                    <ul>
                      <li>Double-check the spelling</li>
                      <li>Change your search query</li>
                      <li>Be less specific</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="row">
                  {filteredProducts.map((product) => {
                    const index = currentImageIndex[product.id] || 0;

                    return (
                      <ProductItem
                        key={product.id}
                        product={product}
                        index={index}
                        onPrev={() =>
                          handlePrevImage(product.id, product.images.length)
                        }
                        onNext={() =>
                          handleNextImage(product.id, product.images.length)
                        }
                        handleProductClick={handleProductClick}
                      />
                    );
                  })}
                </div>
              )}
            </main>

            {hasMore && !loading ? (
              <div className="text-center m-4 pb-4">
                <button className="view-more-btn" onClick={fetchMoreProducts}>
                  View more
                </button>
              </div>
            ) : (
              <div className="my-4 pb-4"></div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductList;
