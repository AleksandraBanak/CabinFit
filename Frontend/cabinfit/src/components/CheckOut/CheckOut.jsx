import { useState, useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import cashIcon from "../../assets/pay-with-cash.png";
import CheckoutButton from "../CheckoutButton/CheckoutButton";
import "./CheckOut.css";

function CheckOut() {
  const { cartItems, cart, voucher } = useContext(StoreContext);

  const [shippingInfo, setShippingInfo] = useState({
    firstname: "",
    lastname: "",
    email: "",
    address: "",
    city: "",
    zip: "",
    country: "",
    phone: "",
  });

  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [errors, setErrors] = useState({});

  const baseTotal = cart?.total ?? 0;

  const voucherDiscount = voucher?.discountPercentage
    ? voucher.discountPercentage / 100
    : 0;

  const discountedTotal =
    voucherDiscount > 0 ? baseTotal * (1 - voucherDiscount) : baseTotal;

  const shippingCost =
    shippingMethod === "standard"
      ? 0
      : shippingMethod === "express"
        ? 9.99
        : 49.99;

  const finalTotal = discountedTotal + shippingCost;

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="checkout-page">
      <div className="checkout-form">
        <h2 className="text-center">Shipping Information</h2>
        <hr />
        <form>
          <h2 className="card-header-custom">Customer</h2>
          <div className="form-row">
            <div className="form-group form-multiple">
              <label>First Name</label>
              <input
                name="firstname"
                value={shippingInfo.firstname}
                onChange={handleShippingChange}
                required
              />
              {errors.firstname && (
                <div className="text-danger">{errors.firstname}</div>
              )}
            </div>
            <div className="form-group form-multiple">
              <label>Last Name</label>
              <input
                name="lastname"
                value={shippingInfo.lastname}
                onChange={handleShippingChange}
                required
              />
              {errors.lastname && (
                <div className="text-danger">{errors.lastname}</div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              name="email"
              type="email"
              value={shippingInfo.email}
              onChange={handleShippingChange}
              required
            />
            {errors.email && <div className="text-danger">{errors.email}</div>}
          </div>

          <h2 className="card-header-custom">Delivery</h2>
          <div className="form-group">
            <label>Address</label>
            <input
              name="address"
              value={shippingInfo.address}
              onChange={handleShippingChange}
              required
            />
            {errors.address && (
              <div className="text-danger">{errors.address}</div>
            )}
          </div>

          <div className="form-row">
            <div className="form-group form-multiple">
              <label>City</label>
              <input
                name="city"
                value={shippingInfo.city}
                onChange={handleShippingChange}
                required
              />
              {errors.city && <div className="text-danger">{errors.city}</div>}
            </div>
            <div className="form-group form-multiple">
              <label>ZIP / Postal Code</label>
              <input
                name="zip"
                value={shippingInfo.zip}
                onChange={handleShippingChange}
                required
              />
              {errors.zip && <div className="text-danger">{errors.zip}</div>}
            </div>
          </div>

          <div className="form-group">
            <label>Country</label>
            <input
              name="country"
              value={shippingInfo.country}
              onChange={handleShippingChange}
              required
            />
            {errors.country && (
              <div className="text-danger">{errors.country}</div>
            )}
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              name="phone"
              value={shippingInfo.phone}
              onChange={handleShippingChange}
              required
            />
            {errors.phone && <div className="text-danger">{errors.phone}</div>}
          </div>

          <h2 className="card-header-custom">Shipping Method</h2>

          <div className="shipping-option d-flex flex-row justify-content-between">
            <div>
              <label>
                <input
                  type="radio"
                  name="shippingMethod"
                  value="standard"
                  checked={shippingMethod === "standard"}
                  onChange={(e) => setShippingMethod(e.target.value)}
                />
                Standard Delivery (5–7 Business Days)
              </label>
            </div>
            <strong className="text-success">FREE</strong>
          </div>

          <div className="shipping-option d-flex flex-row justify-content-between">
            <div>
              <label>
                <input
                  type="radio"
                  name="shippingMethod"
                  value="express"
                  checked={shippingMethod === "express"}
                  onChange={(e) => setShippingMethod(e.target.value)}
                />
                Express Delivery (3–5 Business Days)
              </label>
            </div>
            <strong className="fw-bold">€9.99</strong>
          </div>

          <div className="shipping-option d-flex flex-row justify-content-between">
            <div>
              <label>
                <input
                  type="radio"
                  name="shippingMethod"
                  value="priority"
                  checked={shippingMethod === "priority"}
                  onChange={(e) => setShippingMethod(e.target.value)}
                />
                Priority (1–2 Business Days)
              </label>
            </div>
            <strong className="fw-bold">€49.99</strong>
          </div>

          <h2 className="card-header-custom">Payment Method</h2>
          <div className="payment-methods-container">
            <div
              className={`payment-method-option ${paymentMethod === "cash" ? "selected" : ""}`}
              onClick={() => setPaymentMethod("cash")}
            >
              <img src={cashIcon} alt="Cash on Delivery Icon" />
              <label>
                <div className="d-flex flex-row align-items-center gap-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={() => setPaymentMethod("cash")}
                  />
                  Cash on Delivery
                </div>
              </label>
              <span className="description">
                Payment will be collected upon package pickup
              </span>
            </div>

            <div
              className={`payment-method-option ${paymentMethod === "card" ? "selected" : ""}`}
              onClick={() => setPaymentMethod("card")}
            >
              <i className="fa-regular fa-credit-card card-icon"></i>
              <label>
                <div className="d-flex flex-row align-items-center gap-2">
                  <input
                    className="align-self-center"
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                  />
                  Pay by Card
                </div>
              </label>
              <span className="description">Pay online via CaSys / cPay</span>
            </div>
          </div>

          <CheckoutButton
            items={cartItems}
            shippingInfo={shippingInfo}
            shippingMethod={shippingMethod}
            paymentMethod={paymentMethod}
            errors={errors}
            setErrors={setErrors}
          />
        </form>
      </div>

      <div className="order-summary">
        <div className="order-summary-card">
          <div className="summary-header-row">
            <span className="summary-eyebrow">ORDER SUMMARY</span>
            <span className="summary-count-inline">
              ({cartItems.length} item{cartItems.length !== 1 ? "s" : ""})
              &nbsp;
              <strong>€{discountedTotal.toFixed(2)}</strong>
            </span>
          </div>

          <ul className="summary-items">
            {cartItems.map((item) => {
              const hasDiscount = item.discountPercentage > 0;
              const discountedPrice =
                item.price * (1 - item.discountPercentage / 100);
              return (
                <li key={item.id} className="summary-item-card">
                  <div className="summary-item-thumb">
                    {item.productImages?.[0] ? (
                      <img
                        src={`https://localhost:7203${item.productImages[0]}`}
                        alt={item.productName}
                      />
                    ) : (
                      <div className="thumb-placeholder" />
                    )}
                  </div>
                  <div className="summary-item-left">
                    <div className="summary-item-title">{item.productName}</div>
                    <div className="summary-item-meta">
                      Quantity: {item.quantity}
                    </div>
                    <div className="summary-item-meta">
                      Each: €{item.price.toFixed(2)}
                    </div>
                  </div>
                  <div className="summary-item-price">
                    <div className="summary-price-new">
                      €{discountedPrice.toFixed(2)}
                    </div>
                    {hasDiscount && (
                      <div className="summary-price-old">
                        €{item.price.toFixed(2)}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="summary-divider" />

          <div className="summary-row">
            <span>Subtotal</span>
            <span>€{baseTotal.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <div>
              <span>Shipping</span>
              <p className="shipping-sub">
                {shippingMethod === "standard"
                  ? "Standard (5–7 Business Days)"
                  : shippingMethod === "express"
                    ? "Express (3–5 Business Days)"
                    : "Priority (1–2 Business Days)"}
              </p>
            </div>
            <span>
              {shippingMethod === "standard" ? (
                <span className="text-success fw-bold">FREE</span>
              ) : shippingMethod === "express" ? (
                "€9.99"
              ) : (
                "€49.99"
              )}
            </span>
          </div>

          {voucherDiscount > 0 && (
            <div className="summary-row summary-discount-row">
              <span>Voucher Discount</span>
              <span>-{voucher?.discountPercentage}%</span>
            </div>
          )}

          <div className="summary-divider" />

          <div className="summary-total">
            <span>Total</span>
            {voucherDiscount > 0 ? (
              <span className="summary-total-price">
                <span className="summary-total-old">
                  €{baseTotal.toFixed(2)}
                </span>
                <span className="summary-total-new">
                  €{finalTotal.toFixed(2)}
                </span>
              </span>
            ) : (
              <span className="summary-total-new">
                €{finalTotal.toFixed(2)}
              </span>
            )}
          </div>

          <p className="summary-legal">
            By clicking PLACE ORDER, you agree to our{" "}
            <a href="#">Terms of Use</a> and <a href="#">Privacy Policy</a>.
          </p>

          <CheckoutButton
            items={cartItems}
            shippingInfo={shippingInfo}
            shippingMethod={shippingMethod}
            paymentMethod={paymentMethod}
            errors={errors}
            setErrors={setErrors}
            summaryStyle={true}
          />
        </div>
      </div>
    </div>
  );
}

export default CheckOut;
