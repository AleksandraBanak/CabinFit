import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, ShoppingBag, Heart } from "lucide-react";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { AuthContext } from "../../context/AuthProvider";
import api from "../../api/axios"
import "./ProductItem.css";
import Swal from "sweetalert2";
import ColorCircle from "../ui/ColorCircle";
import RatingStars from "../UI/RatingStars";
import { WishlistContext } from "../../context/WishlistContext";


function ProductItem({ product, index, onPrev, onNext, handleProductClick }) {
  const { addToCart, cartItems, fetchProductList } = useContext(StoreContext);
  const { user } = useContext(AuthContext);
  const currentCartItem = cartItems.find( (item) => item.productId === product.id);
  const quantityInCart = currentCartItem?.quantity ?? 0;
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const inWishlist = isInWishlist(product.id);

  const handleWishlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate("/login");
      return;
    }

    await toggleWishlist(product);
  };

  const images = product.images || [];
  const imageUrl =
    images.length > 0
      ? `https://localhost:7203${images[index]}`
      : "https://via.placeholder.com/300";

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await api.delete(`/product/${id}`);
      alert("Product deleted successfully");
      fetchProductList();
    } catch (err) {
      console.error("Failed to delete product:", err);
      alert("Failed to delete product");
    }
  };

  const handleAddToCart = () => {
    if (quantityInCart >= product.stockQuantity) {
      Swal.fire({
        icon: "warning",
        title: "Not enough stock",
        text: `Only ${quantityInCart} item(s) available.`,
        confirmButtonColor: "#212529",
        confirmButtonText: "OK",
      });
      return;
    }

    addToCart(product);
  };



  return (
    <div className="col-lg-3 col-md-4 mb-4 product-card-wrapper" onClick={handleProductClick}>
      <div className="card shadow-sm position-relative minimal-card">
        <div className="image-wrapper">
          <button
            className={`wishlist-heart ${inWishlist ? "active" : ""}`}
            onClick={handleWishlistClick}
          >
            <Heart size={18} fill={inWishlist ? "currentColor" : "none"} />
          </button>
          {product.discountPercentage > 0 && (
            <div className="discount-overlay-badge">
              -{product.discountPercentage}%
            </div>
          )}

          {images.length > 1 && (
            <>
              <button
                className="nav-arrow-btn btn btn-light start-0"
                onClick={onPrev}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                className="nav-arrow-btn btn btn-light position-absolute end-0"
                onClick={onNext}
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          <Link to={`/products/${product.id}`}>
            <img
              src={imageUrl}
              className="card-img-top product-img"
              alt={product.name}
              onClick={() => {
                sessionStorage.setItem(
                  "productsScrollY",
                  String(window.scrollY),
                );
              }}
            />
          </Link>
        </div>

        <div className="card-body d-flex flex-column pt-0">
          <div className="d-flex justify-content-between gap-2 mb-2">
            <Link
              to={`/products/${product.id}`}
              className="text-decoration-none text-dark"
            >
              <h6 className="card-title mb-0">{product.name}</h6>
            </Link>
            <div className="d-flex align-items-center gap-2">
              <ColorCircle color={product.color} />
            </div>
          </div>

          <div className="price-wrapper">
            {product.discountPercentage > 0 ? (
              <>
                <div className="d-flex align-items-center gap-2">
                  <span className="current-price discounted">
                    {product.finalPrice} €
                  </span>{" "}
                  /{" "}
                  <span className="current-price text-decoration-line-through text-muted">
                    {" "}
                    {product.price} €{" "}
                  </span>
                </div>
              </>
            ) : (
              <div className="">
                <span className="current-price">{product.price} €</span>
              </div>
            )}
          </div>

          <div className="d-flex justify-content-between align-items-center mb-1">
            <p className="small text-secondary mb-0">
              {product.width}x{product.height}x{product.depth} cm
            </p>
            <RatingStars
              value={product.averageRating}
              count={product.ratingsCount}
            />
          </div>

          <p className="small mt-2 mb-2 d-flex justify-content-between align-items-center">
            <span>
              <strong>Category:</strong> {product.categoryName}
            </span>
            {user?.roles?.includes("admin") && product.stockQuantity === 0 && (
              <span className="badge bg-success-subtle text-dark outOfStock align-self-center">
                Out of stock
              </span>
            )}
          </p>

          <button
            className="btn-add-cart btn btn-outline-secondary mt-auto"
            onClick={handleAddToCart}
          >
            <ShoppingBag size={16} strokeWidth={2} />
            <span className="cart-span">Add to Cart</span>
          </button>

          {user?.roles?.includes("admin") && (
            <div className="d-flex gap-2 mt-2">
              <Link
                to={`/products/edit/${product.id}`}
                className="btn btn-secondary w-50"
              >
                Edit
              </Link>

              <button
                className="btn btn-danger w-50"
                onClick={() => handleDelete(product.id)}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductItem;