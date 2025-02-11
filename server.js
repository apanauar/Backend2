const express = require("express");
const mongoose = require("mongoose");
const passport = require("./Config/Passport");
console.log("📌 Cargando rutas...");
const authRoutes = require("./Routes/auth");
console.log("📌 Rutas cargadas:", authRoutes.stack?.map(layer => layer.route?.path));
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(passport.initialize());

// Rutas
app.use("/api/auth", authRoutes);

// Conectar a MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("🟢 Conectado a MongoDB"))
  .catch(err => {
    console.error("🔴 Error en la conexión a MongoDB:", err.message);
    process.exit(1); // Detiene el servidor si no se conecta a la base de datos
  });


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Servidor en http://localhost:${PORT}`));
