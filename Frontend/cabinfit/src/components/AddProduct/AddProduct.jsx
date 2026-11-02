import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import "./AddProduct.css";
import { StoreContext } from "../../context/StoreContext";


export default function AddProduct() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { fetchProductList } = useContext(StoreContext);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    discountPercentage: "",
    width: "",
    height: "",
    depth: "",
    stockQuantity: "",
    categoryId: "",
    color: ""
  });


  const [images, setImages] = useState([]);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setImages(newFiles);
  };

  const isAnyFieldEmpty =
    Object.values(form).some((value) => value === "" || value === null) ||
    images.length === 0;


  useEffect(() => {
    if (!isEdit) return;

    const loadProduct = async () => {
      try {
        const res = await api.get(`/product/${id}`);
        setForm({
          name: res.data.name,
          description: res.data.description,
          price: res.data.price,
          discountPercentage: res.data.discountPercentage ?? "",
          width: res.data.width,
          height: res.data.height,
          depth: res.data.depth,
          stockQuantity: res.data.stockQuantity,
          categoryId: res.data.categoryId,
          color: res.data.color ?? ""
        });
      } catch (err) {
        console.error("Failed to load product:", err);
      }
    };

    loadProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      images.forEach((img) => formData.append("Images", img));

      if (isEdit) {
        if (isAnyFieldEmpty) {
          await api.patch(`/product/${id}`, formData);
        } else {
          await api.put(`/product/${id}`, formData);
        }
        setMessage("Product updated successfully!");
      } else {
        await api.post("/product", formData);
        setMessage("Product created successfully!");
      }

      await fetchProductList();
    } catch (err) {
      console.log("Error submitting form:", err);
      const data = err.response?.data;

      const modelErrors = data?.errors; // <-- IMPORTANT

      if (modelErrors) {
        const messages = Object.values(modelErrors).flat().join("\n");
        setMessage(messages);
      } else if (typeof data === "string") {
        setMessage(data);
      } else {
        setMessage("Something went wrong.");
      }
    }

  };


  return (
    <div className="add-product-container">
      <h2>Add Product</h2>

      {message && <p className="text-center text-primary fw-bold">{message}</p>}

      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={form.name}
            onChange={handleChange}
            required={!isEdit}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            className="form-control"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Price (€)</label>
          <input
            type="number"
            name="price"
            step="0.01"
            className="form-control"
            value={form.price}
            onChange={handleChange}
            required={!isEdit}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Discount (%)</label>
          <input
            type="number"
            name="discountPercentage"
            step="0.01"
            min="0"
            max="100"
            className="form-control"
            value={form.discountPercentage}
            onChange={handleChange}
            placeholder="0 - 100"
          />
        </div>

        {form.price && form.discountPercentage && (
          <p className="text-muted mt-2">
            Final price:{" "}
            {(
              form.price -
              (form.price * form.discountPercentage) / 100
            ).toFixed(2)}{" "}
            €
          </p>
        )}

        <div className="row">
          <div className="col mb-3">
            <label className="form-label">Width</label>
            <input
              type="number"
              name="width"
              className="form-control"
              value={form.width}
              onChange={handleChange}
              required={!isEdit}
            />
          </div>

          <div className="col mb-3">
            <label className="form-label">Height</label>
            <input
              type="number"
              name="height"
              className="form-control"
              value={form.height}
              onChange={handleChange}
              required={!isEdit}
            />
          </div>

          <div className="col mb-3">
            <label className="form-label">Depth</label>
            <input
              type="number"
              name="depth"
              className="form-control"
              value={form.depth}
              onChange={handleChange}
              required={!isEdit}
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Stock Quantity</label>
          <input
            type="number"
            name="stockQuantity"
            className="form-control"
            value={form.stockQuantity}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Color</label>
          <input
            type="text"
            name="color"
            className="form-control"
            value={form.color}
            onChange={handleChange}
            placeholder="e.g. Black, Gray, Blue"
            required={!isEdit}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Category ID</label>
          <input
            type="number"
            name="categoryId"
            className="form-control"
            value={form.categoryId}
            onChange={handleChange}
            required={!isEdit}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Product Images</label>
          <input
            type="file"
            multiple
            className="form-control"
            onChange={handleImageChange}
            accept="image/*"
          />
        </div>

        <button type="submit" className="btn btn-secondary submit-btn">
          Save Product
        </button>
      </form>
    </div>
  );
}
