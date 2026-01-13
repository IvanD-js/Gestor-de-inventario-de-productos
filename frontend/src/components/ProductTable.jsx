// frontend/src/components/ProductTable.jsx
import { useEffect, useState } from "react";
import api from "../services/api";

export default function ProductTable({ refreshKey }) {
  const [productos, setProductos] = useState([]);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({ nombre: "", precio: "", stock: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const obtenerProductos = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/");
      setProductos(res.data.data ?? res.data);
    } catch (err) {
      setError("Error al cargar productos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerProductos();
  }, [refreshKey]);

  const eliminarProducto = async (id) => {
    const ok = window.confirm("¿Estás seguro que deseas eliminar este producto?");
    if (!ok) return;
    try {
      await api.delete(`/${id}`);
      await obtenerProductos();
    } catch (err) {
      alert("Error al eliminar");
    }
  };

  const iniciarEdicion = (producto) => {
    setEditando(producto._id);
    setForm({ nombre: producto.nombre, precio: producto.precio, stock: producto.stock });
  };

  const guardarEdicion = async () => {
    try {
      await api.put(`/${editando}`, {
        nombre: form.nombre,
        precio: Number(form.precio),
        stock: Number(form.stock),
      });
      setEditando(null);
      await obtenerProductos();
    } catch (err) {
      alert("Error al guardar cambios");
    }
  };

  if (loading) return <div>Cargando productos...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="table-container">
      <table className="product-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Codigo</th>
            <th>Nombre</th>
            <th>Precio ($)</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p._id}>
              <td style={{ fontSize: 12 }}>{p._id}</td>
              <td>
                {editando === p._id ? (
                  <input
                    value={form.codigo}
                    onChange={(e) =>
                      setForm({ ...form, codigo: e.target.value })
                    }
                  />
                ) : (
                  p.codigo
                )}
              </td>
              <td>
                {editando === p._id ? (
                  <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
                ) : (
                  p.nombre
                )}
              </td>
              <td>
                {editando === p._id ? (
                  <input type="number" value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} />
                ) : (
                  Number(p.precio).toFixed(2)
                )}
              </td>
              <td>
                {editando === p._id ? (
                  <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
                ) : (
                  p.stock
                )}
              </td>
              <td>
                {editando === p._id ? (
                  <button className="save-btn" onClick={guardarEdicion}>Guardar</button>
                ) : (
                  <button className="edit-btn" onClick={() => iniciarEdicion(p)}>Editar</button>
                )}
                <button className="delete-btn" onClick={() => eliminarProducto(p._id)}>Eliminar</button>
              </td>
            </tr>
          ))}
          {productos.length === 0 && (
            <tr><td colSpan="5">No hay productos</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
