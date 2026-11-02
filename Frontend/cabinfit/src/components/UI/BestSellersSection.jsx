import { useEffect, useRef, useState } from "react";
import ProductItem from "../ProductItem/ProductItem";
import api from "../../api/axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "../UI/css/BestSellersSection.css";

export default function BestSellersSection() {
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState({});

  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const response = await api.get("/product", {
          params: {
            page: 1,
            pageSize: 10,
            sort: "BestSellers",
          },
        });

        setBestSellers(response.data.items || []);
      } catch (error) {
        console.error("Failed to fetch best sellers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;

    const card = container.querySelector(".slider-item");
    if (!card) return;

    const cardWidth = card.getBoundingClientRect().width;

    const style = window.getComputedStyle(container);
    const gap = parseFloat(style.gap) || 0;
    const scrollStep = cardWidth + gap;
    const start = container.scrollLeft;

    const target =
      direction === "left"
        ? Math.max(0, start - scrollStep)
        : Math.min(
            container.scrollWidth - container.clientWidth,
            start + scrollStep,
          );

    const duration = 700;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const ease = 1 - Math.pow(1 - progress, 3);
      container.scrollLeft = start + (target - start) * ease;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

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

  const handleProductClick = () => {
    sessionStorage.setItem("productListScrollPos", window.scrollY.toString());
  };

  if (loading) {
    return (
      <section className="best-sellers-section mt-4">
        <div className="best-sellers-header ps-3">
          <h2 className="best-sellers-title">Customer Favorites</h2>
        </div>
        <hr />

        <div className="best-sellers-full">
          <div className="slider-container">
            {[...Array(4)].map((_, i) => (
              <div className="slider-item" key={i}>
                <div className="skeleton-card">
                  <div className="skeleton-image" />
                  <div className="skeleton-text" />
                  <div className="skeleton-text small" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="best-sellers-section mt-4">
      <div className="best-sellers-header ps-3">
        <div>
          <h2 className="best-sellers-title">Customer Favorites</h2>
        </div>
      </div>
      <hr />
      <div className="best-sellers-full">
        <button className="slider-btn left" onClick={() => scroll("left")}>
          <ChevronLeft size={22} />
        </button>

        <button className="slider-btn right" onClick={() => scroll("right")}>
          <ChevronRight size={22} />
        </button>

        <div className="slider-container" ref={scrollRef}>
          {bestSellers.map((product) => {
            const index = currentImageIndex[product.id] || 0;

            return (
              <div className="slider-item" key={product.id}>
                <ProductItem
                  product={product}
                  index={index}
                  onPrev={() =>
                    handlePrevImage(product.id, product.images?.length || 1)
                  }
                  onNext={() =>
                    handleNextImage(product.id, product.images?.length || 1)
                  }
                  handleProductClick={handleProductClick}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
