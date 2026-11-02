import { Star } from "lucide-react";
import "./css/RatingStars.css";

export default function RatingStars({
  value = 0,
  size = 16,
  interactive = false,
  onChange,
  className = "",
}) {
  const displayValue = Number(value) || 0;

  const handleClick = (n) => {
    if (!interactive) return;
    onChange?.(n);
  };

  const handleKeyDown = (e, n) => {
    if (!interactive) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onChange?.(n);
    }
  };

  return (
    <div className={`rating-stars ${className}`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = displayValue >= n;
        const half = !filled && displayValue >= n - 0.5;

        return (
          <span
            key={n}
            className={`star ${interactive ? "interactive" : ""}`}
            role={interactive ? "button" : undefined}
            tabIndex={interactive ? 0 : -1}
            onClick={() => handleClick(n)}
            onKeyDown={(e) => handleKeyDown(e, n)}
            aria-label={interactive ? `Rate ${n} stars` : undefined}
          >
            <Star
              size={size}
              className={`star-icon ${filled ? "filled" : half ? "half" : "empty"}`}
            />
          </span>
        );
      })}
    </div>
  );
}
