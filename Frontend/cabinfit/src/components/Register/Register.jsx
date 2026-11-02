import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios"; 
import Swal from "sweetalert2";
import registerBg from "../../assets/LoginImage.webp"; 
import './Register.css';

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(
        "/auth/Register",
        {
          UserName: formData.userName,
          Email: formData.email,
          Password: formData.password,
          ConfirmPassword: formData.confirmPassword,
          FirstName: formData.firstName,
          LastName: formData.lastName,
          PhoneNumber: formData.phoneNumber,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );

      if (response.status === 200) {
        const { voucherCode, discount } = response.data || {};

        if (voucherCode) {
          await Swal.fire({
            icon: "success",
            title: "Welcome to CabinFit!",
            html: `
              <p>You received a <b>${discount}%</b> voucher for your first order 🎁</p>
              <p style="margin-top:10px;">
                Your code: <b style="font-size:18px;">${voucherCode}</b>
              </p>
            `,
            confirmButtonColor: "#000",
          });
        } else {
          await Swal.fire({
            icon: "success",
            title: "Account created successfully!",
            confirmButtonColor: "#000",
          });
        }

        navigate("/login", { state: { from: "/" }, replace: true });
      }
    } catch (err) {
      console.error("Registration failed:", err);

      if (err.response?.status === 400) {
        const data = err.response.data;

        const errors = data?.errors || data?.Errors || [];

        if (Array.isArray(errors)) {
          const newFieldErrors = {};
          const generalErrors = [];

          errors.forEach((msg) => {
            const lower = msg.toLowerCase();

            if (lower.includes("phone")) {
              newFieldErrors.phoneNumber = msg;
            } else if (lower.includes("email")) {
              newFieldErrors.email = msg;
            } else if (
              lower.includes("username") ||
              lower.includes("user name")
            ) {
              newFieldErrors.userName = msg;
            } else if (lower.includes("first name")) {
              newFieldErrors.firstName = msg;
            } else if (lower.includes("last name")) {
              newFieldErrors.lastName = msg;
            } else if (lower.includes("password")) {
              newFieldErrors.password = msg;
            } else if (lower.includes("confirm password")) {
              newFieldErrors.confirmPassword = msg;
            } else {
              generalErrors.push(msg);
            }
          });

          setFieldErrors(newFieldErrors);

          if (generalErrors.length > 0) {
            setError(generalErrors.join(" "));
          }
        } else if (typeof data === "string") {
          setError(data);
        } else {
          setError("Registration failed.");
        }
      } else {
        setError("Registration failed. Please try again.");
      }
    }
  };


  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100">
      <div className="container">
        <div className="card login-card">
          <div className="row g-0">
            <div className="col-lg-6 register-form-col">
              <div className="d-flex flex-column justify-content-center h-100">
                <h1 className="welcome-title font-serif">Create Account</h1>

                {error && (   
                  <div
                    className="alert alert-danger py-1 small ps-3"
                    style={{ whiteSpace: "pre-line" }}
                  >
                  <i className="bi bi-circle-fill"></i>   {error}
                  </div>
                )}

                <form onSubmit={handleRegister}>
                  <div className="row">
                    <div className={`col-md-6 ${!fieldErrors.firstName ? "mb-3" : ""}`}>
                      <label className="form-label fw-bold small required-label">
                        First name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        className="form-control"
                        placeholder="Enter first name"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {fieldErrors.firstName && (
                      <div className="invalid-feedback d-block field-error">
                        {fieldErrors.firstName}
                      </div>
                    )}


                    <div className={`col-md-6 ${!fieldErrors.lastName ? "mb-3" : ""}`}>
                      <label className="form-label fw-bold small required-label">
                        Last name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        className="form-control"
                        placeholder="Enter last name"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {fieldErrors.lastName && (
                    <div className="invalid-feedback d-block field-error">
                      {fieldErrors.lastName}
                    </div>
                  )}

                  <div className={`${!fieldErrors.userName ? "mb-3" : ""}`}>
                    <label className="form-label fw-bold small required-label">
                      Username
                    </label>
                    <input
                      type="text"
                      name="userName"
                      className="form-control"
                      placeholder="Choose a username"
                      value={formData.userName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {fieldErrors.userName && (
                    <div className="invalid-feedback d-block mb-1 field-error">
                      {fieldErrors.userName}
                    </div>
                  )}

                  <div className={`${!fieldErrors.phoneNumber ? "mb-3" : "mb-0"}`}>
                    <label className="form-label fw-bold small required-label">
                      Phone number
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      className="form-control"
                      placeholder="+389 7X XXX XXX"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {fieldErrors.phoneNumber && (
                    <div className="invalid-feedback d-block mb-1 field-error">
                      {fieldErrors.phoneNumber}
                    </div>
                  )}

                  <div className={`${!fieldErrors.email ? "mb-3" : ""}`}>
                    <label className="form-label fw-bold small required-label">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {fieldErrors.email && (
                    <div className="invalid-feedback d-block mb-1 field-error">
                      {fieldErrors.email}
                    </div>
                  )}
                  <div className={`${!fieldErrors.password ? "mb-3" : ""}`}>
                    <label className="form-label fw-bold small required-label">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={6}
                    />
                  </div>

                  {fieldErrors.password && (
                    <div className="invalid-feedback d-block mb-1 field-error">
                      {fieldErrors.password}
                    </div>
                  )}

                  <div className="mb-4">
                    <label className="form-label fw-bold small required-label">
                      Confirm password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      className="form-control"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      minLength={6}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-black w-100 mb-3 fw-bold"
                  >
                    Sign Up
                  </button>

                  <div className="mt-2 mb-2">
                    <div className="row text-center">
                      <div className="col-4">
                        <i
                          className="fas fa-shipping-fast mb-2 text-muted"
                          style={{ fontSize: "1.1rem" }}
                        ></i>
                        <p
                          className="small text-muted"
                          style={{ fontSize: "0.67rem" }}
                        >
                          Fast Delivery
                        </p>
                      </div>
                      <div className="col-4">
                        <i
                          className="fas fa-heart mb-2 text-muted"
                          style={{ fontSize: "1.1rem" }}
                        ></i>
                        <p
                          className="small text-muted"
                          style={{ fontSize: "0.67rem" }}
                        >
                          Diverse Selection
                        </p>
                      </div>
                      <div className="col-4">
                        <i
                          className="fas fa-history mb-2 text-muted"
                          style={{ fontSize: "1.1rem" }}
                        ></i>
                        <p
                          className="small text-muted"
                          style={{ fontSize: "0.67rem" }}
                        >
                          Order History
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-center mt-2">
                    <p className="small text-muted mb-2">
                      Already have an account?
                    </p>
                    <button
                      type="button"
                      className="btn btn-light-custom w-100 small fw-bold"
                      onClick={() => navigate("/login")}
                    >
                      Login here
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div
              className="col-lg-6 d-none d-lg-block login-image-col"
              style={{ backgroundImage: `url(${registerBg})` }}
            >
              <div className="d-flex flex-column justify-content-end h-100 image-text">
                <h2 className="font-serif">
                  Join the club
                  <br />
                  for exclusive offers...
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}