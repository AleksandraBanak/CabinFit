import { useEffect, useState } from "react";
import api from "../../api/axios";
import Swal from "sweetalert2";
import "../PendingOrders/PendingOrders.css";

function DriverDeliveries() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deliveringId, setDeliveringId] = useState(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/driver/orders/mine");
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to load driver orders", err);
      Swal.fire({
        icon: "error",
        title: "Failed to load deliveries",
        confirmButtonColor: "#111",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleDelivered = async (id) => {
    try {
      setDeliveringId(id);
      await api.post(`/driver/orders/${id}/delivered`);

      Swal.fire({
        icon: "success",
        title: "Order delivered",
        confirmButtonColor: "#111",
      });

      await loadOrders();
    } catch (err) {
      const msg = err.response?.data?.message || "Could not update order.";
      Swal.fire({
        icon: "error",
        title: "Action failed",
        text: msg,
        confirmButtonColor: "#111",
      });
    } finally {
      setDeliveringId(null);
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const sortedOrders = [...orders].sort((a, b) => {
    if (!a.deliveryDueDate && !b.deliveryDueDate) return 0;
    if (!a.deliveryDueDate) return 1;
    if (!b.deliveryDueDate) return -1;

    return new Date(a.deliveryDueDate) - new Date(b.deliveryDueDate);
  });

  const getDueDateInfo = (deliveryDueDate) => {
    if (!deliveryDueDate) {
      return {
        label: "No due date",
        className: "urgency-neutral",
        text: "Not set",
      };
    }

    const dueDate = new Date(deliveryDueDate);
    const normalized = new Date(dueDate);
    normalized.setHours(0, 0, 0, 0);

    if (normalized < today) {
      return {
        label: "Overdue",
        className: "urgency-overdue",
        text: dueDate.toLocaleDateString(),
      };
    }

    if (normalized.getTime() === today.getTime()) {
      return {
        label: "Due today",
        className: "urgency-today",
        text: dueDate.toLocaleDateString(),
      };
    }

    if (normalized.getTime() === tomorrow.getTime()) {
      return {
        label: "Due tomorrow",
        className: "urgency-tomorrow",
        text: dueDate.toLocaleDateString(),
      };
    }

    return {
      label: "Upcoming",
      className: "urgency-upcoming",
      text: dueDate.toLocaleDateString(),
    };
  };

  return (
    <div className="driver-orders-page">
      <div className="driver-orders-shell">
        <div className="driver-orders-header">
          <div>
            <div className="driver-orders-eyebrow">Driver</div>
            <h2 className="driver-orders-title">My Deliveries</h2>
          </div>

          <div className="driver-orders-count">
            {sortedOrders.length} Order{sortedOrders.length !== 1 ? "s" : ""}
          </div>
        </div>

        {loading ? (
          <div className="driver-orders-empty">Loading...</div>
        ) : sortedOrders.length === 0 ? (
          <div className="driver-orders-empty">You have no active deliveries.</div>
        ) : (
          <div className="driver-orders-table-wrap">
            <table className="driver-orders-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Due Date</th>
                  <th>Urgency</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {sortedOrders.map((order) => {
                  const dueDateInfo = getDueDateInfo(order.deliveryDueDate);

                  return (
                    <tr key={order.id}>
                      <td data-label="Order">
                        <div className="order-main-cell">
                          <div className="order-number">#{order.orderNumber}</div>
                          <div className="order-date">
                            {new Date(order.orderDate).toLocaleDateString()}
                          </div>
                        </div>
                      </td>

                      <td data-label="Customer">
                        {order.firstName} {order.lastName}
                      </td>

                      <td data-label="Phone">{order.phoneNumber}</td>

                      <td data-label="Address" className="order-address-cell">
                        {order.shippingAddress}, {order.city}, {order.zip}, {order.country}
                      </td>

                      <td data-label="Due Date">{dueDateInfo.text}</td>

                      <td data-label="Urgency">
                        <span className={`urgency-pill ${dueDateInfo.className}`}>
                          {dueDateInfo.label}
                        </span>
                      </td>

                      <td data-label="Total" className="order-total">
                        €{Number(order.totalAmount).toFixed(2)}
                      </td>

                      <td data-label="Action">
                        <button
                          className="driver-table-btn"
                          onClick={() => handleDelivered(order.id)}
                          disabled={deliveringId === order.id}
                        >
                          {deliveringId === order.id ? "Updating..." : "Delivered"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default DriverDeliveries;