import { useState } from "react";
import "./css/StarRatingInput.css";

export default function StarRatingInput({
  value = 0,  
  onChange,
  disabled = false,
  size = 22,
}) {
  const [hover, setHover] = useState(0);
  const active = hover || value;

  return (
    <div
      className={`star-input ${disabled ? "is-disabled" : ""}`}
      onMouseLeave={() => setHover(0)}
      role="radiogroup"
      aria-label="Rate this product"
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className={`star-btn ${active >= n ? "filled" : ""}`}
          style={{ fontSize: size }}
          disabled={disabled}
          onMouseEnter={() => !disabled && setHover(n)}
          onClick={() => !disabled && onChange?.(n)}
          aria-label={`${n} star`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
