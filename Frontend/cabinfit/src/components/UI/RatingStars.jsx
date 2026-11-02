import "./css/RatingStars.css";

export default function RatingStars({
  value = 0,
  count = 0,
  interactive = false,
  onChange,
  size = 24,
}) {
  const safeValue = Math.max(0, Math.min(5, Number(value) || 0));
  const percentage = (safeValue / 5) * 100;

  const handleClick = (e) => {
    if (!interactive) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    const rating = Math.ceil(percent * 5);

    onChange?.(rating);
  };

  return (
    <div className="rating-row">
      <div
        className="stars"
        style={{ fontSize: size }}
        onClick={handleClick}
        role={interactive ? "button" : undefined}
        aria-label={`${safeValue} out of 5 stars`}
        tabIndex={interactive ? 0 : -1}
      >
        <div className="stars-back">★★★★★</div>
        <div className="stars-front" style={{ width: `${percentage}%` }}>
          ★★★★★
        </div>
      </div>

      {count > 0 && <span className="rating-count">({count})</span>}
    </div>
  );
}

