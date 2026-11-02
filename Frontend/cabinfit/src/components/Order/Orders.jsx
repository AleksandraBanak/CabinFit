import { useEffect, useState } from "react";
import api from "../../api/axios";
import ProfileSidebar from "../Profile/ProfileSidebar";
import { NavLink } from "react-router-dom";
import "./Order.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/userOrders");
        setOrders(res.data || []);
      } catch (error) {
        console.error("Error loading orders:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "order-status pending";
      case "in delivery":
        return "order-status in-delivery";
      case "delivered":
        return "order-status delivered";
      case "cancelled":
        return "order-status cancelled";
      default:
        return "order-status default";
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="spinner-border text-secondary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid bg-light-subtle min-vh-100 font-monospace main-container">
      <div className="row g-0">
        <div className="col-lg-2 p-0 bg-white border-end min-vh-100 d-none d-lg-block">
          <ProfileSidebar />
        </div>
        <div className="col-12 d-lg-none p-3 bg-white border-bottom">
          <strong>My Account</strong>
        </div>

        <div className="col-12 col-lg-10 p-0">
          <div className="order-header-banner"></div>

          <div className="orders-page-wrap">
            <div className="orders-page-card shadow">
              <div className="orders-page-header">
                <div>
                  <div className="orders-eyebrow">Account</div>
                  <h1 className="orders-title">My Orders</h1>
                  <p className="orders-subtitle">
                    Track your recent purchases and view order details.
                  </p>
                </div>

                {!!orders.length && (
                  <div className="orders-count">
                    {orders.length} {orders.length === 1 ? "Order" : "Orders"}
                  </div>
                )}
              </div>

              {orders.length === 0 ? (
                <div className="orders-empty">
                  <h5 className="fw-bold mb-2">No orders yet</h5>
                  <p className="text-muted mb-0">
                    Once you place an order, it will appear here.
                  </p>
                </div>
              ) : (
                <div className="orders-table-wrap">
                  <div className="orders-table-header">
                    <div>Order</div>
                    <div>Date</div>
                    <div>Status</div>
                    <div>Total</div>
                    <div className="text-end"> </div>
                  </div>

                  <div className="orders-table-body">
                    {orders.map((o) => (
                      <div key={o.id} className="orders-table-row">
                        <div className="orders-col order-number-col">
                          <span className="mobile-label">Order</span>
                          <span className="order-number-text">
                            #{o.orderNumber}
                          </span>
                        </div>

                        <div className="orders-col">
                          <span className="mobile-label">Date</span>
                          <span>{new Date(o.orderDate).toLocaleDateString()}</span>
                        </div>

                        <div className="orders-col">
                          <span className="mobile-label">Status</span>
                          <span className={getStatusClass(o.status)}>
                            {o.status}
                          </span>
                        </div>

                        <div className="orders-col">
                          <span className="mobile-label">Total</span>
                          <span className="order-total-text">
                            ${Number(o.totalAmount).toLocaleString()}
                          </span>
                        </div>

                        <div className="orders-col action-col">
                          <NavLink
                            className="text-decoration-none"
                            to={`/order-details/${o.id}`}
                          >
                            <button className="btn order-view-btn">View</button>
                          </NavLink>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="spacer-bottom"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Orders;