import { NavLink, useLocation } from "react-router-dom";
import "./ProfileSidebar.css";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";
import { User, PackageCheck, Truck } from "lucide-react";

export default function ProfileSidebar() {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const roles = user?.roles || user?.Roles || [];
  const isDriver = roles.some((r) => r.toLowerCase() === "driver");

  const isOrdersActive =
    location.pathname.startsWith("/orders") ||
    location.pathname.startsWith("/order-details");

  return (
    <aside className="profile-sidebar">
      <div className="sidebar-card">
        <div className="sidebar-header">
          <h3 className="sidebar-title">My Profile</h3>
          <p className="sidebar-subtitle">
            Manage your account and orders.
          </p>
        </div>

        <nav className="sidebar-nav">
          {/* Profile */}
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <span className="sidebar-link-icon">
              <User size={18} />
            </span>
            <span>Profile</span>
          </NavLink>

          {/* Orders / Driver */}
          {isDriver ? (
            <NavLink
              to="/driver/delivered"
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <span className="sidebar-link-icon">
                <Truck size={18} />
              </span>
              <span>Delivered Orders</span>
            </NavLink>
          ) : (
            <NavLink
              to="/orders"
              className={() =>
                `sidebar-link ${isOrdersActive ? "active" : ""}`
              }
            >
              <span className="sidebar-link-icon">
                <PackageCheck size={18} />
              </span>
              <span>Orders</span>
            </NavLink>
          )}
        </nav>
      </div>
    </aside>
  );
}