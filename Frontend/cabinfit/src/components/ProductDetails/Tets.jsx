import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import { ChevronLeft, ChevronRight } from "lucide-react"; 
import "../ProductDetails/ProductDetails.css"; 
import AuthContext from "../../context/AuthProvider";
import Swal from "sweetalert2";
import api from "../../api/axios"
import RatingPopover from "../Ratings/RatingPopover.jsx";

function ProductDetails() {
  const { id } = useParams();
  const { products, addToCart, cartItems } = useContext(StoreContext);
  const [product, setProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1); 
  const {user} = useContext(AuthContext);

  const [myRating, setMyRatingState] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [ratingsCount, setRatingsCount] = useState(0);


  useEffect(() => {
    const productToBeDisplayed = products.find((prod) => prod.id === parseInt(id));
    setProduct(productToBeDisplayed);
    setCurrentImageIndex(0); 
    console.log(user);

    if (productToBeDisplayed) {
      setAvgRating(productToBeDisplayed.averageRating ?? 0);
      setRatingsCount(productToBeDisplayed.ratingsCount ?? 0);
      console.log(avgRating, ratingsCount);
    }
  }, [id, products, user, avgRating, ratingsCount]);

  useEffect(() => {
    if (!user || !product) return;

    (async () => {
      try {
        const res = await api.get(`/rating/${product.id}/me`);
        setMyRatingState(res.data ?? 0);
      } catch (e) {
        setMyRatingState(0);
      }
    })();
  }, [user, product]);


  if (!product) return <p>Loading...</p>;

  const currentCartItem = cartItems.find(
    (item) => item.productId === product.id
  );

  const quantityInCart = currentCartItem?.quantity ?? 0;
  const remainingStock = product.stockQuantity - quantityInCart;

  const images = product.images || [];
  const imageUrl = images.length > 0 ? `https://localhost:7203${images[currentImageIndex]}` : "https://via.placeholder.com/500";

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleIncreaseQuantity = () => {
    if(remainingStock == 0){
      Swal.fire({
        icon: "warning",
        title: "Not enough stock",
        text: `No more items available :(`,
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

  return (
    <div className="container mt-4 product-details-page">
      <div className="row justify-content-center">
        <div className="col-lg-5 col-md-12 col-sm-12">
          <div className="main-image-container position-relative mb-3">
            <img src={imageUrl} className="img-fluid" alt={product.name} />

            {images.length > 1 && (
              <>
                <button
                  className="btn position-absolute top-50 start-0 translate-middle-y product-image-nav"
                  onClick={handlePrevImage}
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  className="btn position-absolute top-50 end-0 translate-middle-y product-image-nav"
                  onClick={handleNextImage}
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>

          <div className="d-flex gap-2 justify-content-start flex-wrap thumbnail-images">
            {images.map((img, index) => (
              <img
                key={index}
                src={`https://localhost:7203${img}`}
                className={`img-thumbnail ${currentImageIndex === index ? "active-thumbnail" : ""}`}
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "cover",
                  cursor: "pointer",
                }}
                alt={`Thumbnail ${index + 1}`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        </div>

        <div className="col-lg-6 col-md-12 col-sm-12 product-info-column">
          {" "}
          <h2 className="product-name">{product.name}</h2>
          <RatingPopover
            productId={product.id}
            averageRating={product.averageRating}
            ratingsCount={product.ratingsCount}
            isLoggedIn={!!user}
          />
          <div className="product-details-specs">
            <p>{product.description}</p>
          </div>
          <div className="product-details-dimentions mb-3">
            <p className="mb-1">Dimentions:</p>
            <p className="mb-0 ps-3">Depth: {product.depth}cm</p>
            <p className="mb-0 ps-3">Width: {product.width}cm</p>
            <p className="mb-0 ps-3">Height: {product.height}cm</p>
          </div>
          <div className="price-section-stack mb-4">
            {product.discountPercentage > 0 ? (
              <div className="d-flex flex-column gap-1">
                <span className="discount-text-top">
                  Discount {product.discountPercentage}%
                </span>

                <span className="original-price-middle">
                  {product.price.toFixed(2)} EUR
                </span>

                <div className="d-flex align-items-center gap-3">
                  <span className="final-price-bottom">
                    {(
                      product.price -
                      (product.price * product.discountPercentage) / 100
                    ).toFixed(2)}{" "}
                    EUR
                  </span>
                  <span className="savings-text-label">
                    Savings:{" "}
                    {(
                      (product.price * product.discountPercentage) /
                      100
                    ).toFixed(2)}{" "}
                    EUR
                  </span>

                  <span
                    className={`stock-badge ms-auto ${product.stockQuantity > 0 ? "in-stock" : "out-of-stock"}`}
                  >
                    {product.stockQuantity > 0 ? (
                      <>
                        In Stock <i className="bi bi-check-lg"></i>
                      </>
                    ) : (
                      "Out of Stock"
                    )}
                  </span>
                </div>
              </div>
            ) : (
              <div className="d-flex align-items-center">
                <span className="final-price-bottom text-dark">
                  {product.price.toFixed(2)} EUR
                </span>
                <span
                  className={`stock-badge ms-auto ${product.stockQuantity > 0 ? "in-stock" : "out-of-stock"}`}
                >
                  {product.stockQuantity > 0 ? "In Stock" : "Out of Stock"}
                </span>
              </div>
            )}
          </div>
          <div className="product-options mb-4">
            <div className="d-flex align-items-center mb-4">
              <div className="input-group quantity-control me-3 w-auto">
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                >
                  -
                </button>
                <input
                  type="text"
                  className="form-control text-center"
                  value={quantity}
                  readOnly
                  style={{ width: "50px" }}
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={handleIncreaseQuantity}
                >
                  +
                </button>
              </div>
              <button
                className="btn btn-dark add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={remainingStock <= 0}
              >
                ADD TO CART
              </button>
            </div>
          </div>
          <hr className="my-3" />
          <div className="d-flex justify-content-between align-items-center mt-3">
            <a
              href="#"
              className="text-decoration-none text-dark d-flex align-items-center"
            >
              <span className="me-2">&#9829;</span> Add to wish list
            </a>
            <a
              href="#"
              className="text-decoration-none text-dark d-flex align-items-center"
            >
              <span className="me-2">&#8644;</span> Add to compare list
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;