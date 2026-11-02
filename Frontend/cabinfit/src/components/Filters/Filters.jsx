import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react"; 
import { StoreContext } from "../../context/StoreContext";
import { useContext } from "react";
import "./Filters.css";

const Filters = ({
  minAvailablePrice,
  maxAvailablePrice,
  user
}) => {
  const navigate = useNavigate();
  const { fetchProductList, setCurrentSort, setCurrentCategories, 
          setCurrentSizes, setCurrentColors, currentCategories,
          currentSizes, currentColors, currentSort, allCategories, allColors } = useContext(StoreContext);
  
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [sort, setSort] = useState("None");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);

  
  const toggleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const filterRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sizeCategories = [
    { label: "Personal / Underseat", min: 35.5, max: 43.2 },
    { label: "International Carry On", min: 45.7, max: 53.3 },
    { label: "Medium Checked", min: 61, max: 68.6 },
    { label: "Large Checked", min: 71.1, max: 76.2 },
    { label: "Extra Large Checked", min: 78.7, max: Infinity },
  ];

  useEffect(() => {
    if (minAvailablePrice && maxAvailablePrice) {
      setMinPrice(minAvailablePrice);
      setMaxPrice(maxAvailablePrice);
    }
  }, [minAvailablePrice, maxAvailablePrice]);

  const handlePriceRangeChange = (e) => {
    const { name, value } = e.target;

    if (name === "min") setMinPrice(Number(value));
    if (name === "max") setMaxPrice(Number(value));
  };

  const handleCategoryChange = (categoryId, checked) => {
    const newCategories = checked
      ? [...currentCategories, categoryId]
      : currentCategories.filter((c) => c !== categoryId);

      console.log("Selected categories:", newCategories);

    setCurrentCategories(newCategories);
    fetchProductList(currentSort, false, minPrice, maxPrice, newCategories, currentSizes, currentColors);
  };

  const handleSizeChange = (label, checked) => {
    const newSizes = checked
      ? [...currentSizes, label]
      : currentSizes.filter((s) => s !== label);

    setCurrentSizes(newSizes);
    fetchProductList(currentSort, false, minPrice, maxPrice, currentCategories, newSizes, currentColors);
  };

  const handleColorChange = (color, checked) => {
    const newColors = checked
      ? [...currentColors, color]
      : currentColors.filter((c) => c !== color);

    setCurrentColors(newColors);
    fetchProductList(currentSort, false, minPrice, maxPrice, currentCategories, currentSizes, newColors);
  };

  const handleSortChange = (value) => {
    setSort(value);
    setCurrentSort(value);
    fetchProductList(value, false, minPrice, maxPrice);
  };


  return (
    <div className="filters-bar-container" ref={filterRef}>
      <div className="filters-bar">
        <span className="filters-label">FILTER BY:</span>
        <div className="filter-item">
          <button
            className={`filter-btn ${activeDropdown === "category" ? "active" : ""}`}
            onClick={() => toggleDropdown("category")}
          >
            CATEGORY{" "}
            {activeDropdown === "category" ? (
              <ChevronUp size={14} />
            ) : (
              <ChevronDown size={14} />
            )}
          </button>

          {activeDropdown === "category" && (
            <div className="filter-dropdown-menu">
              {allCategories.map((cat) => (
                <label key={cat.id} className="checkbox-label">
                  <input
                    type="checkbox"
                    className="checkbox-input"
                    value={cat.id}
                    checked={currentCategories.includes(cat.id)}
                    onChange={(e) =>
                      handleCategoryChange(cat.id, e.target.checked)
                    }
                  />
                  {cat.name}
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="filter-item">
          <button
            className={`filter-btn ${activeDropdown === "price" ? "active" : ""}`}
            onClick={() => toggleDropdown("price")}
          >
            PRICE{" "}
            {activeDropdown === "price" ? (
              <ChevronUp size={14} />
            ) : (
              <ChevronDown size={14} />
            )}
          </button>

          {activeDropdown === "price" && (
            <div className="filter-dropdown-menu" style={{ minWidth: "300px" }}>
              <div className="d-flex justify-content-between small fw-bold mb-2">
                <span>${minPrice.toFixed(0)}</span>
                <span>${maxPrice.toFixed(0)}</span>
              </div>

              <div className="range-slider-container">
                <input
                  type="range"
                  min={minAvailablePrice}
                  max={maxAvailablePrice}
                  step="1"
                  value={minPrice}
                  name="min"
                  onChange={handlePriceRangeChange}
                  className="range-slider"
                />
                <input
                  type="range"
                  min={minAvailablePrice}
                  max={maxAvailablePrice}
                  step="1"
                  value={maxPrice}
                  name="max"
                  onChange={handlePriceRangeChange}
                  className="range-slider"
                />
                <div
                  className="slider-filled-track"
                  style={{
                    left: `${((minPrice - minAvailablePrice) / (maxAvailablePrice - minAvailablePrice)) * 100}%`,
                    right: `${100 - ((maxPrice - minAvailablePrice) / (maxAvailablePrice - minAvailablePrice)) * 100}%`,
                  }}
                ></div>
              </div>

              <div className="mt-3 text-center">
                <button
                  className="apply-filter-btn"
                  onClick={() => {
                    fetchProductList(sort, false, minPrice, maxPrice);
                    setActiveDropdown(null);
                  }}
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="filter-item">
          <button
            className={`filter-btn ${activeDropdown === "size" ? "active" : ""}`}
            onClick={() => toggleDropdown("size")}
          >
            SIZE{" "}
            {activeDropdown === "size" ? (
              <ChevronUp size={14} />
            ) : (
              <ChevronDown size={14} />
            )}
          </button>

          {activeDropdown === "size" && (
            <div className="filter-dropdown-menu">
              {sizeCategories.map((cat) => (
                <label key={cat.label} className="checkbox-label">
                  <input
                    type="checkbox"
                    className="checkbox-input"
                    value={cat.label}
                    checked={currentSizes.includes(cat.label)}
                    onChange={(e) =>
                      handleSizeChange(cat.label, e.target.checked)
                    }
                  />
                  {cat.label}
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="filter-item">
          <button
            className={`filter-btn ${activeDropdown === "color" ? "active" : ""}`}
            onClick={() => toggleDropdown("color")}
          >
            COLOR{" "}
            {activeDropdown === "color" ? (
              <ChevronUp size={14} />
            ) : (
              <ChevronDown size={14} />
            )}
          </button>

          {activeDropdown === "color" && (
            <div className="filter-dropdown-menu">
              {allColors.map((c) => (
                <label key={c} className="checkbox-label">
                  <input
                    type="checkbox"
                    className="checkbox-input"
                    value={c}
                    checked={currentColors.includes(c)}
                    onChange={(e) => handleColorChange(c, e.target.checked)}
                  />
                  {c}
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="filter-item ms-auto">
          <button
            className={`filter-btn ${activeDropdown === "sort" ? "active" : ""}`}
            onClick={() => toggleDropdown("sort")}
          >
            SORT{" "}
            {activeDropdown === "sort" ? (
              <ChevronUp size={14} />
            ) : (
              <ChevronDown size={14} />
            )}
          </button>

          {activeDropdown === "sort" && (
            <div className="filter-dropdown-menu" style={{ minWidth: "180px" }}>
              {[
                { label: "Price: Low to High", value: "priceAsc" },
                { label: "Price: High to Low", value: "priceDesc" },
                { label: "Top Rated", value: "ratingDesc" },
                { label: "Size: Small to Large", value: "sizeAsc" },
                { label: "Size: Large to Small", value: "sizeDesc" },
                { label: "Best Sellers", value: "bestSellers" },
              ].map((option) => (
                <label key={option.value} className="checkbox-label">
                  <input
                    type="radio"
                    name="sort"
                    value={option.value}
                    checked={sort === option.value}
                    onChange={() => handleSortChange(option.value)}
                    className="sort-input"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          )}
        </div>

        {user?.roles?.includes("admin") && (
          <div className="">
            <button
              className="btn-admin-small"
              onClick={() => navigate("/admin/add-product")}
            >
              + Add Product
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Filters;