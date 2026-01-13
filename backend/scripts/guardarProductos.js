// scripts/guardarProductos.js
import fs from "fs";
import fetch from "node-fetch";

async function guardar() {
  const res = await fetch(process.env.MONGO_URI || "http://localhost:5000/api/productos");
  const data = await res.json();
  fs.writeFileSync("productos.json", JSON.stringify(data, null, 2));
  console.log("productos.json creado");
}

guardar();

export default guardar;