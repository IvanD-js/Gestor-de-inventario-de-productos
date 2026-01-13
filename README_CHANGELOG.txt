Cambios aplicados por el asistente:
- backend/controllers/productoController.js: Implementado CRUD completo con respuestas JSON consistentes.
- backend/routes/productoRoutes.js: Añadida ruta GET /:id y export actualizado.
- backend/server.js: Mejorado con helmet, morgan, middleware de errores y ruta raíz /.
- frontend/src/services/api.js: BaseURL configurada desde REACT_APP_API_URL, timeout agregado.
- frontend/src/components/ProductForm.jsx: Formulario con validación, estados de loading y manejo de errores.
- frontend/src/components/ProductTable.jsx: Tabla con ID, carga, edición inline, confirmación de borrado y manejo de errores.
- Agregados backend/.env.example y frontend/.env.example. .env reales NO incluidos.
- Añadido .gitignore en la raíz para excluir node_modules y .env.
- Añadida clase .form-error a frontend/src/App.css

Recomendaciones urgentes:
- ROTA las credenciales de MongoDB Atlas (ya expuestas en commits anteriores).
- No subir archivos .env al repositorio.
- Instalar dependencias adicionales (morgan, helmet) si quieres usar server.js mejorado:
    cd backend
    npm install morgan helmet