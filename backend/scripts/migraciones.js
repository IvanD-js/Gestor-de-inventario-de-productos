// backend/scripts/migrarAsignarCodigo.js
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Producto from "../models/producto.js";

dotenv.config();

const migrar = async () => {
  try {
    await connectDB();
    console.log("Conectado a DB para migración");

    // Buscar productos sin codigo
    const sinCodigo = await Producto.find({ $or: [{ codigo: { $exists: false } }, { codigo: null }] }).sort({ _id: 1 });

    if (sinCodigo.length === 0) {
      console.log("No hay productos sin codigo. Nada que hacer.");
      process.exit(0);
    }

    // Obtener el mayor codigo actual
    const ultimo = await Producto.findOne({ codigo: { $ne: null } }).sort({ codigo: -1 }).select("codigo").lean();
    let next = ultimo ? Number(ultimo.codigo) + 1 : 1;

    for (const p of sinCodigo) {
      p.codigo = next++;
      await p.save();
      console.log(`Producto ${p._id} -> codigo ${p.codigo}`);
    }

    console.log("Migración completada.");
    process.exit(0);
  } catch (err) {
    console.error("Error migrando:", err);
    process.exit(1);
  }
};

migrar();
