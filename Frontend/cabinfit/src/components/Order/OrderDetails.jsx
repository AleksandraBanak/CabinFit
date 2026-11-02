import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import ProfileSidebar from "../Profile/ProfileSidebar";
import "./OrderDetails.css";

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      try {
        const res = await api.get(`/order/${id}`);
        setOrder(res.data);
      } catch (error) {
        console.error("Error loading order:", error);
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light-field">
        <div className="spinner-border text-secondary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!order) {
    return <div className="p-5 text-center">Order not found.</div>;
  }

  const getStatusBadge = (status) => {
    console.log(status);
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-info letter-spacing";
      case "in delivery":
        return "bg-primary";
      case "delivered":
        return "bg-success";
      case "cancelled":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  return (
    <div className="container-fluid bg-light-subtle min-vh-100 font-monospace main-container">
      <div className="row g-0">
        <div className="col-md-3 col-lg-2 p-0 bg-white border-end min-vh-100 d-none d-md-block">
          <ProfileSidebar />
        </div>
        <div className="col-md-9 col-lg-10 p-0">
          <div className="order-header-banner"></div>

          <div className="container px-4 order-content-wrapper">
            <div className="d-flex justify-content-between align-items-end mb-4">
              <div>
                <button
                  onClick={() => navigate(-1)}
                  className="btn btn-sm btn-light border shadow-sm mb-3 px-3 rounded-pill fw-bold text-secondary mt-4 back-btn"
                >
                  ← Back to Orders
                </button>
                <h2 className="fw-bold mb-1 text-dark">
                  Order #{order.orderNumber}
                </h2>
                <div className="d-flex align-items-center gap-3">
                  <span className="text-secondary small">
                    Placed: {new Date(order.orderDate).toLocaleString()}
                  </span>
                  <span
                    className={`status badge rounded-pill px-3 ${getStatusBadge(order.status)}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="card border-0 rounded-4 bg-white p-4 main-orderDetails-card">
              <div className="card-body">
                <h5 className="fw-bold text-dark mb-4">
                  Shipping & Customer Details
                </h5>

                <div className="row g-4 mb-5">
                  <div className="col-md-6">
                    <label>First Name</label>
                    <div className="info-field">{order.firstName}</div>
                  </div>

                  <div className="col-md-6">
                    <label>Last Name</label>
                    <div className="info-field">{order.lastName}</div>
                  </div>

                  <div className="col-md-6">
                    <label>Email Address</label>
                    <div className="info-field">{order.email}</div>
                  </div>

                  <div className="col-md-6">
                    <label>Phone Number</label>
                    <div className="info-field">{order.phoneNumber}</div>
                  </div>

                  <div className="col-12">
                    <label>Shipping Address</label>
                    <div className="info-field">
                      {order.shippingAddress}, {order.city} {order.zip},{" "}
                      {order.country}
                    </div>
                  </div>
                </div>

                <hr className="my-5 text-muted opacity-25" />

                <h5 className="fw-bold text-dark mb-3">Items Ordered</h5>
                <div className="table-responsive mb-4">
                  <table className="table align-middle">
                    <thead className="bg-light-field">
                      <tr>
                        <th className="border-0 text-secondary small py-3 table-col-product">
                          Product
                        </th>
                        <th className="border-0 text-secondary small py-3 text-center">
                          Qty
                        </th>
                        <th className="border-0 text-secondary small py-3 text-end">
                          Price
                        </th>
                        <th className="border-0 text-secondary small py-3 text-end">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.orderItems.map((item) => (
                        <tr key={item.id}>
                          <td className="py-3">
                            <div className="d-flex align-items-center">
                              <div className="rounded border bg-white d-flex align-items-center justify-content-center me-3 product-img-container">
                                <img
                                  src={`https://localhost:7203${item.productImage}`}
                                  alt={item.productName}
                                  className="product-img"
                                />
                              </div>
                              <div>
                                <span className="fw-medium d-block text-dark">
                                  {item.productName}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="text-center fw-medium text-secondary">
                            x{item.quantity}
                          </td>
                          <td className="text-end text-muted text-table">
                            ${item.price.toLocaleString()}
                          </td>
                          <td className="text-end fw-bold text-dark text-table">
                            ${item.subtotal.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="row justify-content-end">
                  <div className="col-md-5 col-lg-4">
                    <div className="order-summary-divider">
                      <div className="order-total-card">
                        <div className="order-total-row">
                          <div>
                            <div className="order-total-label">Order Total</div>
                            <div className="text-muted small">
                              Final amount paid
                            </div>
                          </div>
                          <div className="order-total-value">
                            ${order.totalAmount.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="spacer-bottom"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
