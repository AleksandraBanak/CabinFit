import api from "../../api/axios";
import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "./DriverNavbar.css";

export default function DriverNavbar() {
  const { setToken, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/auth/Logout", {});
      localStorage.removeItem("accessToken");
      setToken(null);
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <nav className="driver-nav navbar navbar-expand-md bg-white border-bottom">
      <div className="container-fluid px-4">
        <NavLink className="navbar-brand driver-logo" to="/driver/pending">
          <i className="bi bi-truck me-2"></i>
          CabinFit Deliver
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#driverNavbar"
          aria-controls="driverNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="driverNavbar">
          <ul className="navbar-nav ms-auto align-items-md-center gap-md-3">
            <li className="nav-item">
              <NavLink className="nav-link" to="/driver/pending">
                Pending Orders
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/driver/mine">
                My Deliveries
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/profile">
                Profile
              </NavLink>
            </li>

            <li className="nav-item">
              <button className="btn btn-dark btn-sm px-3" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}