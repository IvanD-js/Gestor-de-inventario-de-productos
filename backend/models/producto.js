// backend/models/producto.js
import mongoose from "mongoose";

const productoSchema = new mongoose.Schema({
  codigo: {
    type: Number,
    unique: true,
    sparse: true // permite documentos sin codigo antes de migrar
  },
  nombre: { type: String, required: true },
  precio: { type: Number, required: true },
  stock: { type: Number, required: true },
}, { timestamps: true });

const Producto = mongoose.model("Producto", productoSchema);
export default Producto;
