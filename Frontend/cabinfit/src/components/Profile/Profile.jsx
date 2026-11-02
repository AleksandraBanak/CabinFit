import { useEffect, useState, useContext } from "react";
import api from "../../api/axios";
import { AuthContext } from "../../context/AuthProvider";
import ProfileSidebar from "../../components/Profile/ProfileSidebar";
import "./Profile.css";

export default function ProfilePage() {
  const { user, setUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [vouchers, setVouchers] = useState([]);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    phoneNumber: "",
  });

  const roles = user?.roles || user?.Roles || [];
  const isDriver = roles.some((r) => r.toLowerCase() === "driver");

  const startEditing = () => {
    setForm({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      userName: user.userName || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
    });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const saveProfile = async () => {
    try {
      const res = await api.put("/auth/user", form);
      const userRes = await api.get("/auth/user");
      setUser(userRes.data);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update profile", err);
      alert("Failed to update profile");
    }
  };

  useEffect(() => {
    if (!user) return;

    const loadVouchers = async () => {
      try {
        const res = await api.get("/voucher/my");
        setVouchers(res.data || []);
      } catch (err) {
        console.error("Failed to load vouchers", err);
        setVouchers([]);
      }
    };

    loadVouchers();
  }, [user]);

  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const defaultAvatar =
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

  return (
    <div className="container-fluid bg-light-subtle min-vh-100 font-monospace profile-container">
      <div className="row g-0">
        <div className="col-md-3 col-lg-2 p-0 bg-white border-end min-vh-100 d-none d-md-block ">
          <ProfileSidebar />
        </div>

        <div className="col-12 d-md-none p-3 bg-white border-bottom">
          <strong>My App</strong>
        </div>

        <div className="col-md-9 col-lg-10 p-0">
          <div
            style={{
              height: "220px",
              borderBottom: "1px solid rgb(222, 226, 230)",
              backgroundColor: "rgba(224, 229, 236, 1)",
            }}
          ></div>

          <div
            className="container px-4"
            style={{ marginTop: "-150px", maxWidth: "1100px" }}
          >
            <div className="card shadow border-0 rounded-4 bg-white p-2">
              <div className="card-body p-4">
                <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start mb-5">
                  <div className="me-md-4 mb-3 mb-md-0">
                    <div
                      className="rounded-circle overflow-hidden shadow-sm"
                      style={{
                        width: "100px",
                        height: "100px",
                        border: "4px solid #fff",
                      }}
                    >
                      <img
                        src={defaultAvatar}
                        alt="Profile"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex-grow-1 text-center text-md-start pt-4">
                    <h3 className="fw-bold text-dark mb-1">
                      {user.firstName} {user.lastName}
                    </h3>
                    <small className="text-muted">{user.email}</small>
                  </div>

                  <div className="mt-3 mt-md-0">
                    {!isEditing ? (
                      <button
                        className="btn btn-primary px-4 py-2 rounded-3 border-0 shadow-sm"
                        style={{ backgroundColor: "#3b82f6" }}
                        onClick={startEditing}
                      >
                        Edit
                      </button>
                    ) : (
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-primary px-4"
                          onClick={saveProfile}
                        >
                          Save
                        </button>
                        <button
                          className="btn btn-outline-secondary px-4"
                          onClick={cancelEditing}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="row g-4">
                  <div className="col-md-6">
                    <label className="text-muted small fw-bold mb-2">
                      First Name
                    </label>
                    {isEditing ? (
                      <input
                        className="form-control p-3 profile-field rounded-3 text-dark fw-medium"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                      />
                    ) : (
                      <div className="p-3 profile-field rounded-3 text-dark fw-medium">
                        {user.firstName || "N/A"}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="text-muted small fw-bold mb-2">
                      Last Name
                    </label>

                    {isEditing ? (
                      <input
                        className="form-control p-3 profile-field rounded-3 text-dark fw-medium"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                      />
                    ) : (
                      <div className="p-3 profile-field rounded-3 text-dark fw-medium">
                        {user.lastName || "N/A"}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="text-muted small fw-bold mb-2">
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        className="form-control p-3 profile-field rounded-3 text-dark fw-medium"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                      />
                    ) : (
                      <div className="p-3 profile-field rounded-3 text-dark fw-medium">
                        {user.email}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="text-muted small fw-bold mb-2">
                      Username
                    </label>
                    {isEditing ? (
                      <input
                        className="form-control p-3 profile-field rounded-3 text-dark fw-medium"
                        name="userName"
                        value={form.userName}
                        onChange={handleChange}
                      />
                    ) : (
                      <div className="p-3 profile-field rounded-3 text-dark fw-medium">
                        {user.userName}
                      </div>
                    )}
                  </div>

                  <div className="col-12">
                    <label className="text-muted small fw-bold mb-2">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        className="form-control p-3 profile-field rounded-3 text-dark fw-medium"
                        name="phoneNumber"
                        value={form.phoneNumber}
                        onChange={handleChange}
                      />
                    ) : (
                      <div className="p-3 profile-field rounded-3 text-dark fw-medium">
                        {user.phoneNumber || "N/A"}
                      </div>
                    )}
                  </div>

                  {!isDriver && (
                    <div className="col-12">
                      <label className="text-muted small fw-bold mb-2">
                        My Vouchers
                      </label>

                      <div className="p-3 profile-field rounded-3 text-dark fw-medium">
                        {vouchers.length === 0 ? (
                          <span className="text-muted fw-normal">
                            No vouchers yet.
                          </span>
                        ) : (
                          <div className="d-flex flex-wrap gap-2">
                            {vouchers.map((v) => (
                              <span
                                key={v.id || v.code}
                                className="voucher-pill"
                              >
                                <span className="voucher-code">{v.code}</span>
                                {v.discountPercentage != null && (
                                  <span className="voucher-discount">
                                    -{v.discountPercentage}%
                                  </span>
                                )}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div style={{ height: "50px" }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
