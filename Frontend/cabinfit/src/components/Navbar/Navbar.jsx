import api from "../../api/axios";
import { useNavigate, NavLink, useLocation, useSearchParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import "./Navbar.css";

const Navbar = () => {
  const { token, setToken } = useAuth();
  const { cartItems, isProcessingOrder } = useContext(StoreContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const searchFromUrl = searchParams.get("search") || "";
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    if (location.pathname === "/products") {
      setSearchInput(searchFromUrl);
    } else {
      setSearchInput("");
    }
  }, [location.pathname, searchFromUrl]);

  const handleLogout = async () => {
    try {
      await api.post("/auth/Logout", {});
      localStorage.removeItem("accessToken");
      setToken(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleGuestRedirect = () => {
    navigate("/login");
  };

  const handleGuestRedirectRegister = () => {
    navigate("/register");
  };

  const handleCartClick = (e) => {
    if (!token) {
      e.preventDefault();
      navigate("/login");
    }
  };

  return (
    <>
      <div className="black-top bg-black text-white">
        <p className="text-white nav-p text-uppercase">
          Get the best deals{" "}
          <span className="text-white text-decoration-underline">shop now</span>
        </p>
      </div>
      <nav
        className="mainNav navbar navbar-expand-md bg-white navmain fw-bold "
        aria-label="Main navbar"
      >
        <div className="container-fluid">
          <NavLink className="navbar-brand cabinfit-logo" to="/">
            <i className="bi bi-suitcase"></i>CabinFit
          </NavLink>
          <div className="collapse navbar-collapse" id="navbarsExample04">
            <div className="nav-center">
              <ul className="navbar-nav mb-2 mb-md-0">
                <li className="nav-item">
                  <NavLink className="nav-link" to="/">
                    Home
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/products">
                    Products
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/sale">
                    Sale
                  </NavLink>
                </li>
                <li>
                  <NavLink className="nav-link" to="/about-us">
                    About us
                  </NavLink>
                </li>
              </ul>
            </div>

            {/* Right side: search, profile, bag */}
            <div className="d-flex align-items-center ms-auto gap-1">
              <form
                role="search"
                className="m-0"
                onSubmit={(e) => {
                  e.preventDefault();
                  const trimmed = searchInput.trim();
                  navigate(`/products?search=${encodeURIComponent(trimmed)}`);
                }}
              >
                <input
                  className="form-control"
                  type="search"
                  placeholder="Search products..."
                  aria-label="Search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </form>

              <div className="dropdown d-inline-block">
                <button
                  className="btn btn-profile d-flex align-items-center"
                  type="button"
                  id="profileDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-person-circle fs-4 ps-2"></i>
                </button>

                {token ? (
                  <ul
                    className="dropdown-menu dropdown-menu-end profile-dropdown-menu"
                    aria-labelledby="profileDropdown"
                  >
                    <li>
                      <NavLink
                        className="dropdown-item profile-dropdown-item"
                        to="/profile"
                      >
                        Profile
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        className="dropdown-item profile-dropdown-item"
                        to="/orders"
                      >
                        My orders
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        className="dropdown-item profile-dropdown-item"
                        to="/wishlist"
                      >
                        Wishlist
                      </NavLink>
                    </li>
                    <li>
                      <button
                        className="dropdown-item profile-dropdown-item"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                ) : (
                  <ul
                    className="dropdown-menu dropdown-menu-end profile-dropdown-menu guest-dropdown-menu"
                    aria-labelledby="profileDropdown"
                  >
                    <li>
                      <button
                        type="button"
                        className="dropdown-item profile-dropdown-item guest-dropdown-item active text-uppercase"
                        onClick={handleGuestRedirect}
                      >
                        Sign in
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        className="dropdown-item profile-dropdown-item guest-dropdown-item text-uppercase"
                        onClick={handleGuestRedirectRegister}
                      >
                        Create account
                      </button>
                    </li>
                  </ul>
                )}
              </div>

              <NavLink
                to={token ? "/cart" : "/login"}
                onClick={handleCartClick}
                className="position-relative text-dark me-2"
              >
                <i className="bi bi-handbag fs-4 ps-2"></i>

                {token && !isProcessingOrder && cartItems.length > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-black cart-badge">
                    {cartItems.length}
                  </span>
                )}
              </NavLink>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
