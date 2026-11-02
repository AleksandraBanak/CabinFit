import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import api from "../../api/axios";
import "./CheckoutSuccess.css";

function CheckoutSuccess() {
  const { clearCart, setIsProcessingOrder } = useContext(StoreContext);
  const [isCompleted, setIsCompleted] = useState(false);

  const hasCreatedOrder = React.useRef(false);

  useEffect(() => {
    console.log(hasCreatedOrder.current);
    if (hasCreatedOrder.current) return;
    hasCreatedOrder.current = true;

    const createOrder = async () => {
      try {
        setIsProcessingOrder(true);

        const paymentMethod = localStorage.getItem("lastPaymentMethod");
        console.log("payment " + paymentMethod);
        const shippingInfo = JSON.parse(
          localStorage.getItem("shippingInfo") || "{}",
        );
        console.log(shippingInfo);
        const shippingMethod = localStorage.getItem("shippingMethod");
        console.log("shipping " + shippingMethod);
        const voucherCode = localStorage.getItem("voucherCode");
        console.log("voucher " + voucherCode);

        const res = await api.post("/order", {
          FirstName: shippingInfo.firstname,
          LastName: shippingInfo.lastname,
          Email: shippingInfo.email,
          PhoneNumber: shippingInfo.phone,
          Country: shippingInfo.country,
          City: shippingInfo.city,
          Zip: shippingInfo.zip,
          ShippingAddress: shippingInfo.address,
          ShippingMethod: shippingMethod,
          PaymentMethod: paymentMethod,
          voucherCode: voucherCode || null,
        });

        if (res.status === 201 || res.status === 200) {
          await clearCart();
          localStorage.removeItem("shippingInfo");
          localStorage.removeItem("lastPaymentMethod");
          localStorage.removeItem("voucherCode");
          setIsCompleted(true);
        } else {
          console.error("Order creation failed", res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsProcessingOrder(false);
      }
    };

    createOrder();
  }, [clearCart, setIsProcessingOrder]);

  if (!isCompleted) return null;

  return (
    <div className="checkout-success">
      <h2>Payment Successful!</h2>
      <p>Your order has been placed.</p>
    </div>
  );
}

export default CheckoutSuccess;
