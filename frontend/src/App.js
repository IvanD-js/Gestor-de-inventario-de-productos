import "./App.css";
import ProductForm from "./components/ProductForm";
import ProductTable from "./components/ProductTable";
import { useState } from "react";
import logomongo from "./assets/logomongo.png";
import logoreact from "./assets/logoreact.png";

function App() {
  const [recargar, setRecargar] = useState(false);
  const actualizar = () => setRecargar(!recargar);

  return (
    <div className="container">
        <img
            src={logomongo}
            alt="logoMongoDB"
            width="110"
            height="40"
            className="d-inline-block align-top"
        />
         <img
            src={logoreact}
            alt="logoReact"
            width="40"
            height="40"
            className="logo-react"
        />
      <h1>Gestión de Productos</h1>
      <ProductForm onProductAdded={actualizar} />
      <ProductTable key={recargar} />
    </div>
  );
}

export default App;
