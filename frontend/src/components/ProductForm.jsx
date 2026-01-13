// frontend/src/components/ProductForm.jsx
import { useState } from "react";
import api from "../services/api";

export default function ProductForm({ onProductAdded }) {
  const [producto, setProducto] = useState({ nombre: "", precio: "", stock: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setProducto({ ...producto, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!producto.nombre || producto.precio === "" || producto.stock === "") {
      setError("Completa todos los campos.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/", {
        nombre: producto.nombre,
        precio: Number(producto.precio),
        stock: Number(producto.stock)
      });
      setProducto({ nombre: "", precio: "", stock: "" });
      onProductAdded(); // notifica al padre que recargue
    } catch (err) {
      setError(err.response?.data?.message || "Error al agregar producto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <input
        name="nombre"
        placeholder="Nombre del producto"
        onChange={handleChange}
        value={producto.nombre}
        required
      />
      <input
        name="precio"
        type="number"
        min="0"
        step="0.01"
        placeholder="Precio"
        onChange={handleChange}
        value={producto.precio}
        required
      />
      <input
        name="stock"
        type="number"
        min="0"
        placeholder="Stock"
        onChange={handleChange}
        value={producto.stock}
        required
      />
      <button type="submit" disabled={loading}>{loading ? "Guardando..." : "Agregar Producto"}</button>
      {error && <div className="form-error">{error}</div>}
    </form>
  );
}
