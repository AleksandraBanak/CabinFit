import { useContext, useState } from "react";
import { WishlistContext } from "../../context/WishlistContext";
import ProductItem from "../../components/ProductItem/ProductItem";
import "./MyWishlist.css";

function MyWishlist() {
  const { wishlistItems, wishlistLoading } = useContext(WishlistContext);
  const [currentImageIndex, setCurrentImageIndex] = useState({});

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

  if (wishlistLoading) {
    return <p className="text-center mt-4">Loading wishlist...</p>;
  }

  return (
    <div className="container mt-4 wishlist-page product-details-container mb-4 pb-4">
      <div className="wishlist-header mb-4">
        <p className="wishlist-breadcrumb mb-2">Home / My Wishlist</p>
        <h1 className="wishlist-title">MY WISHLIST</h1>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="wishlist-empty text-center py-5">
          <h4>Your wishlist is empty</h4>
          <p>Save products you like and they will appear here.</p>
        </div>
      ) : (
        <div className="row">
          {wishlistItems.map((product) => {
            const index = currentImageIndex[product.productId] || 0;
            const mappedProduct = {
              id: product.productId,
              name: product.productName,
              price: product.price,
              finalPrice: product.finalPrice,
              discountPercentage: product.discountPercentage,
              stockQuantity: product.stockQuantity,
              width: product.width,
              height: product.height,
              depth: product.depth,
              color: product.color,
              categoryName: product.categoryName,
              images: product.images,
              averageRating: product.averageRating,
              ratingsCount: product.ratingsCount,
            };

            return (
              <ProductItem
                key={product.productId}
                product={mappedProduct}
                index={index}
                onPrev={() =>
                  handlePrevImage(product.productId, product.images.length)
                }
                onNext={() =>
                  handleNextImage(product.productId, product.images.length)
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyWishlist;