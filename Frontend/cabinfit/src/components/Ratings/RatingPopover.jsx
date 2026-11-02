import { useMemo, useState, useContext } from "react";
import api from "../../api/axios";
import RatingStars from "../UI/RatingStars";
import "./RatingPopover.css";
import Swal from "sweetalert2";
import { StoreContext } from "../../context/StoreContext";

export default function RatingPopover({
  productId,
  averageRating,
  ratingsCount,
  isLoggedIn,
  onRatingUpdated,
}) {
  const [open, setOpen] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [summary, setSummary] = useState(null);

  const [showRate, setShowRate] = useState(false);
  const [myRating, setMyRating] = useState(null);
  const [saving, setSaving] = useState(false);
  const { updateProductRatingInState } = useContext(StoreContext);

  const safeAvg = Number(summary?.averageRating ?? averageRating ?? 0);
  const safeCount = Number(summary?.ratingsCount ?? ratingsCount ?? 0);

  const totalFromSummary = useMemo(() => {
    if (!summary?.starCounts) return safeCount;

    return (
      Object.values(summary.starCounts).reduce((a, b) => a + (b || 0), 0) ||
      safeCount
    );
  }, [summary, safeCount]);

  const fetchSummary = async () => {
    setLoadingSummary(true);
    try {
      const res = await api.get(`/rating/${productId}/summary`);
      setSummary(res.data);
      return res.data;
    } catch (e) {
      console.error("Failed to load rating summary", e);
      return null;
    } finally {
      setLoadingSummary(false);
    }
  };

  const fetchMyRatingIfNeeded = async () => {
    if (!isLoggedIn || myRating !== null) return;

    try {
      const res = await api.get(`/rating/${productId}/me`);
      setMyRating(res.data?.rating ?? res.data ?? null);
    } catch (e) {
      console.error("Failed to load my rating", e);
    }
  };

  const handleOpen = async () => {
    setOpen(true);
    await fetchSummary();
  };

  const handleLeaveRating = async () => {
    if (!isLoggedIn) {
      Swal.fire({
        icon: "info",
        title: "Login required",
        text: "Please login to leave a rating.",
        confirmButtonColor: "#000",
      });
      return;
    }

    setShowRate(true);
    await fetchMyRatingIfNeeded();
  };

  const submitRating = async (ratingInt) => {
    if (!isLoggedIn) return;

    setSaving(true);

    try {
      await api.post(`/rating/${productId}`, { rating: ratingInt });
      setMyRating(ratingInt);

      const updatedSummary = await fetchSummary();

      if (updatedSummary) {
        onRatingUpdated?.(updatedSummary);
      }

      if (updatedSummary) {
        onRatingUpdated?.(updatedSummary);
        updateProductRatingInState?.(productId, updatedSummary);
      }

      Swal.fire({
        icon: "success",
        title: "Thanks!",
        text: `You rated this ${ratingInt} star(s).`,
        confirmButtonColor: "#000",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: "Rating failed",
        text: "Could not save your rating. Try again.",
        confirmButtonColor: "#000",
      });
      console.error("Failed to save rating", e);
    } finally {
      setSaving(false);
    }
  };

  const starCounts = summary?.starCounts || {};
  const getCount = (n) => Number(starCounts?.[String(n)]) || 0;

  return (
    <div
      className="rating-wrap"
      onMouseEnter={handleOpen}
      onMouseLeave={() => {
        setOpen(false);
        setShowRate(false);
      }}
    >
      <div className="rating-compact">
        <RatingStars value={safeAvg} size={23} />
        <span className="rating-count">({safeCount})</span>
      </div>

      {open && (
        <div className="rating-popover">
          <div className="rating-popover-top">
            <div className="avg">{safeAvg.toFixed(1)}</div>
            <RatingStars value={safeAvg} size={25} />
            <div className="count">{safeCount} ratings</div>
          </div>

          <div className="divider" />

          {loadingSummary ? (
            <div className="loading">Loading…</div>
          ) : (
            <div className="breakdown">
              {[5, 4, 3, 2, 1].map((n) => {
                const c = getCount(n);
                const pct =
                  totalFromSummary > 0 ? (c / totalFromSummary) * 100 : 0;

                return (
                  <div key={n} className="row">
                    <div className="label">{n}★</div>
                    <div className="bar">
                      <div className="fill" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="num">{c}</div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="divider" />

          <button
            className="leave-btn"
            onClick={handleLeaveRating}
            disabled={saving}
          >
            Leave your rating
          </button>

          {showRate && (
            <div className="my-rating">
              <div className="my-rating-label">
                Your rating{myRating ? `: ${myRating}/5` : ""}{" "}
                {saving ? "(saving…)" : ""}
              </div>

              <RatingStars
                value={myRating || 0}
                size={25}
                interactive
                onChange={submitRating}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}