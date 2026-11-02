import { useParams, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  ShoppingBag,
  ShieldCheck,
  Truck,
} from "lucide-react";
import "../ProductDetails/ProductDetails.css";
import AuthContext from "../../context/AuthProvider";
import { WishlistContext } from "../../context/WishlistContext";
import Swal from "sweetalert2";
import api from "../../api/axios";
import RatingPopover from "../Ratings/RatingPopover.jsx";
import ServiceHighlights from "../UI/ServiceHighlights";

function ProductDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const numericId = parseInt(id, 10);

  const { products, addToCart, cartItems } = useContext(StoreContext);
  const { user } = useContext(AuthContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);

  const [product, setProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [myRating, setMyRatingState] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);

  const images = product?.images || [];

  const extendedImages =
    images.length > 1
      ? [images[images.length - 1], ...images, images[0]]
      : images;

  useEffect(() => {
    const productToBeDisplayed = products.find((prod) => prod.id === numericId);

    if (productToBeDisplayed) {
      setProduct(productToBeDisplayed);
      setCurrentImageIndex(productToBeDisplayed.images?.length > 1 ? 1 : 0);
      setQuantity(1);
      setIsTransitioning(true);
    }
  }, [numericId, products]);

  useEffect(() => {
    if (!product) return;

    const fetchLatestRatingSummary = async () => {
      try {
        const res = await api.get(`/rating/${product.id}/summary`);

        setProduct((prev) =>
          prev
            ? {
                ...prev,
                averageRating: Number(
                  res.data?.averageRating ?? prev.averageRating ?? 0,
                ),
                ratingsCount: Number(
                  res.data?.ratingsCount ?? prev.ratingsCount ?? 0,
                ),
              }
            : prev,
        );
      } catch (e) {
        console.error("Failed to load latest rating summary", e);
      }
    };

    fetchLatestRatingSummary();
  }, [product?.id]);

  useEffect(() => {
    const productToBeDisplayed = products.find((prod) => prod.id === numericId);

    if (productToBeDisplayed) {
      setProduct(productToBeDisplayed);
      setCurrentImageIndex(productToBeDisplayed.images?.length > 1 ? 1 : 0);
      setQuantity(1);
      setIsTransitioning(true);
      return;
    }

    const fetchProductById = async () => {
      try {
        const res = await api.get(`/product/${numericId}`);
        setProduct(res.data);
        setCurrentImageIndex(res.data.images?.length > 1 ? 1 : 0);
        setQuantity(1);
        setIsTransitioning(true);
      } catch (err) {
        console.error("Failed to load product", err);
        setProduct(null);
      }
    };

    if (numericId) {
      fetchProductById();
    }
  }, [numericId, products]);

  useEffect(() => {
    if (!user || !product) {
      setMyRatingState(0);
      return;
    }

    (async () => {
      try {
        const res = await api.get(`/rating/${product.id}/me`);
        setMyRatingState(res.data?.rating ?? res.data ?? 0);
      } catch {
        setMyRatingState(0);
      }
    })();
  }, [user, product]);

  useEffect(() => {
    if (images.length <= 1) return;

    let timer;

    if (currentImageIndex === 0) {
      timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentImageIndex(images.length);
      }, 450);
    } else if (currentImageIndex === images.length + 1) {
      timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentImageIndex(1);
      }, 450);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [currentImageIndex, images.length]);

  useEffect(() => {
    if (!isTransitioning) {
      const raf1 = requestAnimationFrame(() => {
        const raf2 = requestAnimationFrame(() => {
          setIsTransitioning(true);
        });

        return () => cancelAnimationFrame(raf2);
      });

      return () => cancelAnimationFrame(raf1);
    }
  }, [isTransitioning]);

  if (!product && products.length === 0) {
    return <p>Loading...</p>;
  }

  if (!product) {
    return <p>Product not found.</p>;
  }

  const inWishlist = isInWishlist(product.id);

  const currentCartItem = cartItems.find(
    (item) => item.productId === product.id,
  );

  const quantityInCart = currentCartItem?.quantity ?? 0;
  const remainingStock = product.stockQuantity - quantityInCart;

  const activeThumbnailIndex =
    images.length > 1 ? currentImageIndex - 1 : currentImageIndex;

  const handleWishlistClick = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    await toggleWishlist(product);
  };

  const handlePrevImage = () => {
    if (images.length <= 1) return;
    setCurrentImageIndex((prev) => prev - 1);
  };

  const handleNextImage = () => {
    if (images.length <= 1) return;
    setCurrentImageIndex((prev) => prev + 1);
  };

  const handleThumbnailClick = (index) => {
    if (images.length <= 1) {
      setCurrentImageIndex(index);
      return;
    }

    setCurrentImageIndex(index + 1);
  };

  const handleDecreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncreaseQuantity = () => {
    if (remainingStock === 0) {
      Swal.fire({
        icon: "warning",
        title: "Not enough stock",
        text: "No more items available.",
        confirmButtonColor: "#000",
      });
      return;
    }

    if (quantity >= remainingStock) {
      Swal.fire({
        icon: "warning",
        title: "Not enough stock",
        text: `Only ${remainingStock} item(s) available.`,
        confirmButtonColor: "#000",
      });
      return;
    }

    setQuantity((prev) => prev + 1);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setQuantity(1);
  };

  const handleRatingUpdated = (updatedSummary) => {
    if (!updatedSummary) return;

    setProduct((prev) =>
      prev
        ? {
            ...prev,
            averageRating: Number(
              updatedSummary.averageRating ?? prev.averageRating ?? 0,
            ),
            ratingsCount: Number(
              updatedSummary.ratingsCount ?? prev.ratingsCount ?? 0,
            ),
          }
        : prev,
    );
  };

  return (
    <>
      <div className="product-details-page">
        <div className="container product-details-container">
          <div className="product-details-grid">
            <div className="product-gallery-sticky">
              <div
                className={`product-gallery-layout ${
                  images.length <= 1 ? "single-image" : ""
                }`}
              >
                {images.length > 1 && (
                  <div className="thumbnail-column">
                    {images.map((img, index) => (
                      <button
                        key={index}
                        type="button"
                        className={`thumbnail-btn ${
                          activeThumbnailIndex === index
                            ? "active-thumbnail"
                            : ""
                        }`}
                        onClick={() => handleThumbnailClick(index)}
                        aria-label={`Show image ${index + 1}`}
                      >
                        <img
                          src={`https://localhost:7203${img}`}
                          alt={`Thumbnail ${index + 1}`}
                        />
                      </button>
                    ))}
                  </div>
                )}

                <div className="main-image-container position-relative">
                  {product.discountPercentage > 0 && (
                    <div className="details-discount-badge">
                      -{product.discountPercentage}%
                    </div>
                  )}

                  <button
                    type="button"
                    className={`details-wishlist-btn ${inWishlist ? "active" : ""}`}
                    onClick={handleWishlistClick}
                    aria-label={
                      inWishlist ? "Remove from wishlist" : "Add to wishlist"
                    }
                  >
                    <Heart
                      size={18}
                      fill={inWishlist ? "currentColor" : "none"}
                    />
                  </button>

                  <div
                    className="main-image-slider"
                    style={{
                      transform: `translateX(-${currentImageIndex * 100}%)`,
                      transition:
                        images.length > 1 && isTransitioning
                          ? "transform 0.45s ease-in-out"
                          : "none",
                    }}
                  >
                    {extendedImages.map((img, index) => (
                      <div className="main-image-slide" key={index}>
                        <img
                          src={`https://localhost:7203${img}`}
                          className="main-product-image"
                          alt={`${product.name} ${index + 1}`}
                        />
                      </div>
                    ))}
                  </div>

                  {images.length > 1 && (
                    <>
                      <button
                        type="button"
                        className="btn product-image-nav product-image-nav-left"
                        onClick={handlePrevImage}
                        aria-label="Previous image"
                      >
                        <ChevronLeft size={22} />
                      </button>

                      <button
                        type="button"
                        className="btn product-image-nav product-image-nav-right"
                        onClick={handleNextImage}
                        aria-label="Next image"
                      >
                        <ChevronRight size={22} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="product-info-side">
              <div className="product-info-column">
                <div className="product-header-block">
                  <h1 className="product-name">{product.name}</h1>

                  <div className="rating-row">
                    <RatingPopover
                      productId={product.id}
                      averageRating={product.averageRating}
                      ratingsCount={product.ratingsCount}
                      isLoggedIn={!!user}
                      myRating={myRating}
                      onRatingUpdated={handleRatingUpdated}
                    />
                  </div>

                  <p className="product-description mt-3">
                    {product.description}
                  </p>
                </div>

                <div className="details-card dimensions-card">
                  <p className="section-label">Dimensions</p>

                  <div className="dimensions-grid">
                    <div>
                      <span>Depth</span>
                      <strong>{product.depth} cm</strong>
                    </div>

                    <div>
                      <span>Width</span>
                      <strong>{product.width} cm</strong>
                    </div>

                    <div>
                      <span>Height</span>
                      <strong>{product.height} cm</strong>
                    </div>
                  </div>
                </div>

                <div className="details-card price-card">
                  <div className="price-top-row">
                    <p className="section-label mb-0">Price</p>

                    <span
                      className={`stock-badge ${
                        product.stockQuantity > 0 ? "in-stock" : "out-of-stock"
                      }`}
                    >
                      {product.stockQuantity > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>

                  {product.discountPercentage > 0 && (
                    <div className="discount-line">
                      {product.discountPercentage}% Discount
                    </div>
                  )}

                  <div className="price-row">
                    <span className="current-price">
                      {(product.discountPercentage > 0
                        ? product.finalPrice
                        : product.price
                      ).toFixed(2)}{" "}
                      EUR
                    </span>

                    {product.discountPercentage > 0 && (
                      <span className="original-price">
                        {product.price.toFixed(2)} EUR
                      </span>
                    )}
                  </div>

                  {product.discountPercentage > 0 && (
                    <div className="savings-text-label">
                      Save{" "}
                      {(
                        (product.price * product.discountPercentage) /
                        100
                      ).toFixed(2)}{" "}
                      EUR
                    </div>
                  )}
                </div>

                <div className="details-card purchase-card">
                  <div className="purchase-row">
                    <div className="quantity-control">
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={handleDecreaseQuantity}
                      >
                        -
                      </button>

                      <input
                        type="text"
                        className="qty-input"
                        value={quantity}
                        readOnly
                      />

                      <button
                        type="button"
                        className="qty-btn"
                        onClick={handleIncreaseQuantity}
                      >
                        +
                      </button>
                    </div>

                    <button
                      className="add-to-cart-btn"
                      onClick={handleAddToCart}
                      disabled={remainingStock <= 0}
                    >
                      <ShoppingBag size={18} />
                      <span>Add to Cart</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    className="details-text-action"
                    onClick={handleWishlistClick}
                  >
                    <Heart
                      size={16}
                      fill={inWishlist ? "currentColor" : "none"}
                    />
                    <span>
                      {inWishlist ? "Saved to wishlist" : "Add to wishlist"}
                    </span>
                  </button>
                </div>

                <div className="details-extra-info">
                  <div className="extra-info-item">
                    <Truck size={18} />
                    <span>Fast shipping available</span>
                  </div>

                  <div className="extra-info-item">
                    <ShieldCheck size={18} />
                    <span>Quality-tested travel gear</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="product-faq-section">
        <div className="container product-details-container">
          <hr className="product-faq-divider" />
          <div className="product-faq-content">
            <h4 className="faq-title">FAQ&apos;s</h4>

            <div className="faq-inner-content">
              <div className="faq-item">
                <p>
                  <strong>Shipping & Delivery</strong>
                </p>
                <p>
                  Once an order has been processed, we are not able to upgrade
                  or change shipping methods. We are also unable to modify or
                  cancel the items on your order once it has been confirmed.
                </p>
                <p>Please allow 1-2 business days for processing.</p>
              </div>

              <div className="faq-item">
                <p>
                  <strong>Warranty Policy</strong>
                </p>
                <p>
                  CabinFit travel equipment is carefully selected and quality
                  tested to meet high standards of durability and dependable
                  performance. Before any product is offered for sale, it is
                  chosen with practicality, function, and frequent travel use in
                  mind. This attention to quality and performance is why
                  Samsonite is Worldproof® and has been for nearly 100 years.
                </p>
                <p>
                  This attention to quality and everyday performance helps
                  ensure that each item is made for modern travelers.
                </p>
              </div>

              <div className="faq-item">
                <p>
                  <strong>Return Policy</strong>
                </p>
                <p>
                  If you are not completely satisfied with your online purchase,
                  you may return unused merchandise within 60 days of the
                  original shipped date for a prompt refund. Shipping and
                  handling charges are not refundable unless the product arrived
                  damaged, or the incorrect product was shipped.
                </p>
                <p>
                  If you return any part of your order and that order was part
                  of a promotion, any refund may be reduced.
                </p>
                <p>
                  Please allow 14 business days for us to process your return.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ServiceHighlights />
    </>
  );
}

export default ProductDetails;
