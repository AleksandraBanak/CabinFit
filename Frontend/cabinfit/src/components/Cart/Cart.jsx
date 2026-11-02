import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import Swal from "sweetalert2";
import "./Cart.css";

function Cart() {
  const navigate = useNavigate();
  const { cartItems, updateCartItem, removeFromCart, cart, applyVoucher, clearVoucher, voucher, voucherCode } = useContext(StoreContext);

  const [promoCode, setPromoCode] = useState("");

  useEffect(() => {
    setPromoCode(voucherCode || "");
  }, [voucherCode]);

  useEffect(() => {
    console.log("Cart items in Cart component:", cartItems);
  }, [cartItems]);

  const subtotal = cart?.total ?? 0;
  const voucherDiscountPct = voucher?.discountPercentage ?? 0;
  const discountAmount =
    voucherDiscountPct > 0 ? subtotal * (voucherDiscountPct / 100) : 0;
  const totalAfterVoucher = Math.max(0, subtotal - discountAmount);

  const handleApplyVoucher = async (e) => {
    e.preventDefault();

    try {
      const applied = await applyVoucher(promoCode);

      Swal.fire({
        icon: "success",
        title: "Voucher applied!",
        text: `${applied.discountPercentage}% discount will be applied at checkout.`,
        confirmButtonColor: "#000",
      });
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Invalid voucher.";

      Swal.fire({
        icon: "error",
        title: "Voucher not valid",
        text: msg,
        confirmButtonColor: "#000",
      });
    }
  };

  const handleRemoveVoucher = () => {
    clearVoucher();
    setPromoCode("");

    Swal.fire({
      icon: "info",
      title: "Voucher removed",
      confirmButtonColor: "#000",
    });
  };

  return (
    <div className="container mt-5 cart-container">
      {cartItems.length > 0 && (
        <h2 className="title" style={{ color: "black" }}>
          Your Bag ({cartItems.length})
        </h2>
      )}

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-inner">
            <div className="empty-cart-icon" aria-hidden="true">
              <i className="bi bi-handbag"></i>
            </div>

            <h2 className="empty-cart-title">YOUR SHOPPING BAG IS EMPTY</h2>

            <Link to="/products" className="empty-cart-cta">
              CONTINUE SHOPPING
            </Link>
          </div>
        </div>
      ) : (
        <div className="row">
          <div className="col-lg-8 col-md-12 mb-4">
            {cartItems.map((item) => (
              <div
                className="cart-item d-flex flex-column flex-md-row align-items-center mb-3"
                key={item.id}
              >
                <div className="cart-img-wrapper">
                  <img
                    src={`https://localhost:7203${item.productImages[0]}`}
                    alt={item.productName}
                    className="cart-item-img"
                  />
                </div>

                <div className="cart-col name text-start">
                  <h5 className="fw-bold">{item.productName}</h5>

                  <div className="d-flex flex-column align-items-start mt-1">
                    <div className="">
                      <span className="size mb-1">
                        <span className="fw-bold ">Size:</span> {item.width}cm x{" "}
                        {item.height}cm x {item.depth}cm
                      </span>{" "}
                    </div>
                    <button
                      onClick={() =>
                        navigate(`/products/${item.productId}`, {
                          state: { product: item },
                        })
                      }
                      className="btn btn-link p-0"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="btn btn-link p-0"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="cart-col price price-wrapper">
                  {item.discountPercentage > 0 ? (
                    <>
                      <div className="d-flex align-items-center gap-2">
                        <span className="discounted">
                          {(
                            item.price *
                            (1 - item.discountPercentage / 100)
                          ).toFixed(2)}{" "}
                          €
                        </span>{" "}
                        /{" "}
                        <span className="text-decoration-line-through text-muted">
                          {" "}
                          {item.price.toFixed(2)} €{" "}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="">
                      <span className="current-price">
                        {item.price.toFixed(2)} €
                      </span>
                    </div>
                  )}
                </div>

                <div className="cart-col qty">
                  <small className="d-block mb-1">Quantity</small>
                  <div className="quantity-controls d-flex align-items-center">
                    <button
                      onClick={() => updateCartItem(item.id, item.quantity - 1)}
                      className="btn btn-outline-danger btn-sm"
                    >
                      -
                    </button>
                    <span className="mx-2">{item.quantity}</span>
                    <button
                      onClick={() => updateCartItem(item.id, item.quantity + 1)}
                      className="btn btn-outline-success btn-sm"
                      disabled={item.quantity >= item.stockQuantity}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="cart-col subtotal">
                  <small>Total</small>
                  <strong>${item.subtotal.toFixed(2)}</strong>
                </div>
              </div>
            ))}
          </div>

          <div className="col-lg-4 col-md-12">
            <div className="cart-summary p-3 border ">
              <h5 className="summary-title">Summary</h5>

              <div className="mb-2">
                <label className="form-label">Have a promo code?</label>
                <div className="row d-flex">
                  <div className="promo-row">
                    <input
                      type="text"
                      placeholder="Enter Promo Code"
                      className="promo-input"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />

                    <button
                      type="button"
                      className="promo-btn"
                      onClick={handleApplyVoucher}
                      disabled={!promoCode.trim() || !!voucher}
                    >
                      APPLY
                    </button>
                  </div>
                </div>

                {voucher ? (
                  <>
                    <div className="text-success mt-2" role="alert">
                      <small className="text-success d-block">
                        Applied Code:{" "}
                        <span className="text-success text-decoration-underline">
                          {voucher.code}
                        </span>{" "}
                        -&gt; {voucher.discountPercentage}% discount
                      </small>
                    </div>

                    <button
                      type="button"
                      className="btn btn-link p-0 mt-1"
                      onClick={handleRemoveVoucher}
                    >
                      Remove voucher
                    </button>
                  </>
                ) : (
                  <small className="text-success d-block mt-1">
                    Save up to 40% with our promo codes!
                  </small>
                )}
              </div>

              <div className="pt-0">
                {voucherDiscountPct > 0 ? (
                  <>
                    <div className="d-flex justify-content-between">
                      <span>Subtotal:</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>

                    <div className="d-flex justify-content-between text-success">
                      <span>
                        Voucher ({voucher.code}) -{voucherDiscountPct}%
                      </span>
                      <span>- ${discountAmount.toFixed(2)}</span>
                    </div>

                    <hr className="my-2" />

                    <div className="d-flex justify-content-between fw-bold">
                      <p>Estimated Total: </p>
                      <p>${totalAfterVoucher.toFixed(2)}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <hr className="my-2" />
                    <div className="d-flex justify-content-between fw-bold">
                      <p>Estimated Total: </p>
                      <p>${subtotal.toFixed(2)}</p>
                    </div>
                  </>
                )}
              </div>

              <Link to={`/checkout`} className="text-decoration-none text-dark">
                <button className="btn btn-dark w-100 checkout">
                  Proceed to Checkout
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
