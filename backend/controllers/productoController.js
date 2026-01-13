// backend/controllers/productoController.js
import Producto from "../models/producto.js";

// Shape de respuesta consistente: { success: boolean, data: ..., message: ... }

// Obtener todos los productos
export const obtenerProductos = async (req, res) => {
  try {
    const productos = await Producto.find();
    return res.status(200).json({ success: true, data: productos });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error al obtener productos", error: error.message });
  }
};

// Obtener un producto por id
export const obtenerProducto = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) return res.status(404).json({ success: false, message: "Producto no encontrado" });
    return res.status(200).json({ success: true, data: producto });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error al obtener producto", error: error.message });
  }
};

// Crear producto (con codigo autoincremental)
export const agregarProducto = async (req, res) => {
  try {
    const { nombre, precio, stock } = req.body;
    if (!nombre || precio == null || stock == null) {
      return res.status(400).json({ success: false, message: "Faltan campos (nombre, precio, stock)" });
    }

    // Obtener el mayor codigo actual (puede haber nulls si no migraste)
    const ultimoConCodigo = await Producto.findOne({ codigo: { $ne: null } }).sort({ codigo: -1 }).select("codigo").lean();
    const nuevoCodigo = ultimoConCodigo ? (Number(ultimoConCodigo.codigo) + 1) : 1;

    const nuevo = new Producto({
      codigo: nuevoCodigo,
      nombre,
      precio: Number(precio),
      stock: Number(stock)
    });

    const guardado = await nuevo.save();
    return res.status(201).json({ success: true, data: guardado, message: "Producto creado correctamente" });
  } catch (error) {
    // Si hay error de duplicado de codigo (raro por race), reintentar o devolver error claro
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "Código duplicado, intenta de nuevo" });
    }
    return res.status(500).json({ success: false, message: "Error al crear producto", error: error.message });
  }
};

// Actualizar producto
export const editarProducto = async (req, res) => {
  try {
    const { nombre, precio, stock } = req.body;
    const update = {};
    if (nombre !== undefined) update.nombre = nombre;
    if (precio !== undefined) update.precio = Number(precio);
    if (stock !== undefined) update.stock = Number(stock);

    const producto = await Producto.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!producto) return res.status(404).json({ success: false, message: "Producto no encontrado" });

    return res.status(200).json({ success: true, data: producto, message: "Producto actualizado" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error al actualizar producto", error: error.message });
  }
};

// Eliminar producto
export const eliminarProducto = async (req, res) => {
  try {
    const producto = await Producto.findByIdAndDelete(req.params.id);
    if (!producto) return res.status(404).json({ success: false, message: "Producto no encontrado" });
    return res.status(200).json({ success: true, message: "Producto eliminado", data: producto });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error al eliminar producto", error: error.message });
  }
};

// Obtener por codigo (nuevo endpoint)
export const obtenerPorCodigo = async (req, res) => {
  try {
    const codigo = Number(req.params.codigo);
    if (Number.isNaN(codigo)) return res.status(400).json({ success: false, message: "Codigo inválido" });

    const producto = await Producto.findOne({ codigo });
    if (!producto) return res.status(404).json({ success: false, message: "Producto no encontrado por codigo" });

    return res.status(200).json({ success: true, data: producto });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error al buscar por codigo", error: error.message });
  }
};
