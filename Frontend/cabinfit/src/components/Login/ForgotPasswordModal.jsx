import { useState } from "react";
import axios from "../../api/axios";
import { useEffect } from "react";
import './Login.css';

export default function ForgotPasswordModal({
  show,
  onClose,
  defaultEmail = "",
}) {
  const [email, setEmail] = useState(defaultEmail);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setEmail(defaultEmail);
      setMessage("");
      setError("");
      setLoading(false);
    }
  }, [show, defaultEmail]);

  if (!show) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("/auth/forgot-password", { email });

      setMessage(
        res.data?.message ||
          "If an account with that email exists, reset instructions have been sent."
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong while sending reset instructions."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-modal-overlay" onClick={onClose}>
      <div className="forgot-modal-box" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="forgot-modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        <h2 className="forgot-modal-title">Forgot your password?</h2>
        <p className="forgot-modal-text">
          Enter the email address you registered with on CabinFit 
          to receive an email to reset your password.
        </p>

        <form onSubmit={handleSubmit}>
          <div className={` ${error || message ? "mb-2" : "mb-4"}`}>
            <label className="form-label forgot-modal-label required-label-login">
               Email Address
            </label>
            <input
              type="email"
              className="form-control forgot-modal-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          {message && <div className="alert alert-success py-2 small">{message}</div>}
          {error && <div className="alert alert-danger py-1 small ps-3">{error}</div>}

          <button
            type="submit"
            className="forgot-modal-submit"
            disabled={loading}
          >
            {loading ? "SENDING..." : "SEND RESET INSTRUCTIONS"}
          </button>

          <button
            type="button"
            className="forgot-modal-cancel"
            onClick={onClose}
          >
            cancel
          </button>
        </form>
      </div>
    </div>
  );
}