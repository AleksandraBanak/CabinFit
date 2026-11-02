import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import axios from "../../api/axios";
import './Login.css';
import ForgotPasswordModal from "../Login/ForgotPasswordModal";
import { useEffect } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showForgotModal, setShowForgotModal] = useState(false);

  const { user, loading, setToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("/auth/login", {
        username: username,
        password: password,
      });

      const accessToken = res.data?.token || res.data;
      if (!accessToken) throw new Error("No token received");

      setToken(accessToken);
      localStorage.setItem("accessToken", accessToken);
      console.log("Login successful, token stored:", accessToken);

      navigate(from, { replace: true });
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      setError("Invalid email or password. Please try again.");
    }
  };

   useEffect(() => {
    if (loading) return;

    const roles = user?.roles || user?.Roles || [];
    const isDriver = roles.some((r) => r.toLowerCase() === "driver");

    if (user) {
      navigate(isDriver ? from || "/driver/pending" : from || "/", {
        replace: true,
      });
    }
  }, [user, loading, navigate, from]);

  return (
    <>
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "calc(100vh - 100px)" }}
      >
        <div className="container">
          <div className="card login-card">
            <div className="row g-0">
              <div className="col-lg-6 p-5">
                <div className="d-flex flex-column justify-content-center h-100">
                  <h1 className="welcome-title font-serif">
                    Welcome
                    <br />
                    back!
                  </h1>

                  {error && (
                    <div className="alert alert-danger py-2 small">{error}</div>
                  )}

                  <form onSubmit={handleLogin}>
                    <div className="mb-3">
                      <label className="form-label fw-bold small">Username</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter your username or email address"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-bold small ">
                        Password
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <div className="text-end mt-2">
                        <button
                          type="button"
                          onClick={() => setShowForgotModal(true)}
                          className="forgot-password-link"
                        >
                          Forgot your password?
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-black w-100 mb-3 fw-bold"
                    >
                      Login
                    </button>

                    <div className="mt-4 mb-4">
                      <div className="row text-center">
                        <div className="col-4">
                          <i
                            className="fas fa-shipping-fast mb-2 text-muted"
                            style={{ fontSize: "1.2rem" }}
                          ></i>
                          <p
                            className="small text-muted"
                            style={{ fontSize: "0.7rem" }}
                          >
                            Fast Delivery
                          </p>
                        </div>
                        <div className="col-4">
                          <i
                            className="fas fa-heart mb-2 text-muted"
                            style={{ fontSize: "1.2rem" }}
                          ></i>
                          <p
                            className="small text-muted"
                            style={{ fontSize: "0.7rem" }}
                          >
                            Diverse Selection
                          </p>
                        </div>
                        <div className="col-4">
                          <i
                            className="fas fa-history mb-2 text-muted"
                            style={{ fontSize: "1.2rem" }}
                          ></i>
                          <p
                            className="small text-muted"
                            style={{ fontSize: "0.7rem" }}
                          >
                            Order History
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="text-center mt-3">
                      <p className="small text-muted mb-2">
                        Don&apos;t have an account?
                      </p>
                      <button
                        type="button"
                        className="btn btn-light-custom w-100 small fw-bold"
                        onClick={() => navigate("/register")}
                      >
                        Create account
                      </button>
                    </div>
                  </form>
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

      <ForgotPasswordModal
        show={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        defaultEmail={username}
      />
    </>
  );
}