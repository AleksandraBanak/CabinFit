import { useEffect, useState } from "react";
import api from "../../api/axios";
import Swal from "sweetalert2";
import ProfileSidebar from "../Profile/ProfileSidebar";
import "./DriverDelivered.css";

function DriverDelivered() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/driver/orders/delivered");
        setOrders(res.data || []);
        console.log(res.data);
      } catch (err) {
        console.error("Failed to load delivered orders", err);
        Swal.fire({
          icon: "error",
          title: "Failed to load delivered orders",
          confirmButtonColor: "#111",
        });
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

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
          <strong>CabinFit Deliver</strong>
        </div>

        <div className="col-12 col-lg-10 p-0">
          <div className="order-header-banner"></div>

          <div className="orders-page-wrap">
            <div className="orders-page-card shadow">
              <div className="orders-page-header">
                <div>
                  <div className="orders-eyebrow">Driver</div>
                  <h1 className="orders-title">Delivered Orders</h1>
                  <p className="orders-subtitle">
                    View all orders you have already delivered.
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
                  <h5 className="fw-bold mb-2">No delivered orders yet</h5>
                  <p className="text-muted mb-0">
                    Delivered orders will appear here.
                  </p>
                </div>
              ) : (
                <div className="orders-table-wrap delivered-orders-table-wrap">
                  <div className="orders-table-header delivered-orders-table-header">
                    <div>Order</div>
                    <div>Customer</div>
                    <div>Phone</div>
                    <div>Shipping method</div>
                    <div>Status</div>
                    <div>Total</div>
                  </div>

                  <div className="orders-table-body">
                    {orders.map((o) => (
                      <div
                        key={o.id}
                        className="orders-table-row delivered-orders-table-row"
                      >
                        <div className="orders-col order-number-col">
                          <span className="mobile-label">Order</span>
                          <span className="order-number-text">
                            #{o.orderNumber}
                          </span>
                          <span className="delivered-order-date">
                            {new Date(o.orderDate).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="orders-col">
                          <span className="mobile-label">Customer</span>
                          <span>
                            {o.firstName} {o.lastName}
                          </span>
                        </div>

                        <div className="orders-col">
                          <span className="mobile-label">Phone</span>
                          <span>{o.phoneNumber}</span>
                        </div>

                        <div className="orders-col">
                          <span className="mobile-label">Shipping </span>
                          <span className="shipping">{o.shippingMethod || "-"}</span>
                        </div>

                        <div className="orders-col">
                          <span className="mobile-label">Status</span>
                          <span className="order-status delivered">
                            {o.status}
                          </span>
                        </div>

                        <div className="orders-col">
                          <span className="mobile-label">Total</span>
                          <span className="order-total-text">
                            €{Number(o.totalAmount).toFixed(2)}
                          </span>
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

export default DriverDelivered;
