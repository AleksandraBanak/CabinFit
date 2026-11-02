import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "../../api/axios";
import "./ResetPassword.css";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const email = useMemo(() => searchParams.get("email") || "", [searchParams]);
  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const isInvalidLink = !email || !token;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!newPassword || !confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("/auth/reset-password", {
        email,
        token,
        newPassword,
        confirmPassword,
      });

      setSuccessMessage("Password has been reset successfully! Now you can log in with your new password.");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Reset password failed:", err.response?.data || err.message);

      const apiErrors = err.response?.data?.errors;
      const apiMessage = err.response?.data?.message;

      if (Array.isArray(apiErrors) && apiErrors.length > 0) {
        if(apiErrors.filter(e => e.includes("Invalid token"))) {
          setError("Failed to reset password. The reset link is invalid or has expired.");
        }
        else setError(apiErrors.join(" "));
      } else if (apiMessage) {
        if(apiMessage.includes("Invalid token")) {
          setError("Failed to reset password. The reset link is invalid or has expired.");
        }
        else setError(apiMessage);
      } else {
        setError("Failed to reset password. The link may be invalid or expired.");
      }
    } finally {
      if(error)
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "calc(100vh - 100px)" }}
    >
      <div className="container">
        <div className="card login-card reset-password-card">
          <div className="row g-0">
            <div className="col-lg-6 p-5">
              <div className="d-flex flex-column justify-content-center h-100">
                <h1 className="welcome-title font-serif">
                  Reset your
                  <br />
                  password
                </h1>

                <p className="reset-password-subtitle">
                  Choose a new password for your CabinFit account.
                </p>

                {isInvalidLink && (
                  <div className="alert alert-danger py-2 small">
                    This reset link is invalid or incomplete.
                  </div>
                )}

                {!isInvalidLink && (
                  <>
                    {error && (
                      <div className="alert alert-danger py-2 small ps-2">
                         {error}
                      </div>
                    )}

                    {successMessage && (
                      <div className="alert alert-success py-2 small">
                        {successMessage}
                      </div>
                    )}

                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label className="form-label fw-bold small">
                          Email
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          value={"alexpban@gmail.com"}
                          readOnly
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-bold small">
                          New Password
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          placeholder="Enter your new password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                        />
                      </div>

                      <div className="mb-4">
                        <label className="form-label fw-bold small">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          placeholder="Confirm your new password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="btn btn-black w-100 mb-3 fw-bold"
                        disabled={loading}
                      >
                        {loading ? "Resetting..." : "Reset Password"}
                      </button>

                      <button
                        type="button"
                        className="btn btn-light-custom w-100 small fw-bold"
                        onClick={() => navigate("/login")}
                      >
                        Back to Login
                      </button>
                    </form>
                  </>
                )}                
              </div>
            </div>

            <div className="col-lg-6 d-none d-lg-block d-md-block login-image-col">
              <div className="d-flex flex-column justify-content-end h-100 image-text">
                <h2 className="font-serif">
                  Travel luggage
                  <br />
                  for any special occasion
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}