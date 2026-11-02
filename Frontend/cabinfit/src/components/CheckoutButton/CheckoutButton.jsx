import { useNavigate } from "react-router-dom";

export default function CheckoutButton({ items, shippingInfo, shippingMethod, paymentMethod, errors, setErrors }) {
  const navigate = useNavigate();

  const checkoutItems = items.map((item) => ({
    Name: item.productName,
    Images: item.productImages.map((img) => `https://localhost:7203${img}`),
    Price: item.price,
    Quantity: item.quantity,
  }));

  const handleCheckout = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!shippingInfo.firstname.trim()) newErrors.firstname = "First name is required";
    if (!shippingInfo.lastname.trim()) newErrors.lastname = "Last name is required";
    if (!shippingInfo.email.trim()) newErrors.email = "Email is required";
    if (!shippingInfo.address.trim()) newErrors.address = "Address is required";
    if (!shippingInfo.city.trim()) newErrors.city = "City is required";
    if (!shippingInfo.zip.trim()) newErrors.zip = "ZIP code is required";
    if (!shippingInfo.country.trim()) newErrors.country = "Country is required";
    if (!shippingInfo.phone.trim()) newErrors.phone = "Phone number is required";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      window.scrollTo({
        top: 0,
        behavior: "smooth", 
      });

      console.log(newErrors);
      return;
    }

    setErrors({});

    const form = e.target.closest("form");
    if (form && !form.checkValidity()) {
      form.reportValidity(); 
      return;
    }

    localStorage.setItem("shippingInfo", JSON.stringify(shippingInfo));
    localStorage.setItem("shippingMethod", shippingMethod);

    if (paymentMethod === "cash") {
      localStorage.setItem("lastPaymentMethod", "cash");
      navigate("/success");
      return;
    }

    localStorage.setItem("lastPaymentMethod", "card");
    const res = await fetch(
      "https://localhost:7203/api/payment/create-checkout-session",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checkoutItems),
      }
    );

    console.log("STATUS:", res.status);

    if (!res.ok) {
      console.log("Response text:", await res.text());
      return;
    }
    const { url } = await res.json();
    window.location.href = url;
  };

  return (
    <button type="button" className="btn btn-primary w-100 btn-checkout text-uppercase" onClick={handleCheckout}>
      Place Order
    </button>
  );
}
