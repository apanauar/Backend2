require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const passport = require("./Config/Passport");
const authRoutes = require("./Routes/auth");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(passport.initialize());

app.use((req, res, next) => {
  console.log(`🟡 Petición recibida: ${req.method} ${req.originalUrl}`);
  next();
});

// Rutas
app.use("/api/auth",authRoutes);
console.log("📌 Listado de rutas registradas en Express:");
app._router.stack.forEach((layer) => {
  if (layer.route) {
    console.log(`🔹 ${Object.keys(layer.route.methods).join(", ").toUpperCase()} ${layer.route.path}`);
  } else if (layer.name === "router" && layer.handle.stack) {
    layer.handle.stack.forEach((nestedLayer) => {
      if (nestedLayer.route) {
        console.log(`🔹 ${Object.keys(nestedLayer.route.methods).join(", ").toUpperCase()} ${nestedLayer.route.path}`);
      }
    });
  }
});
app.get("/", (req, res) => {
  res.send("🟢 Servidor funcionando");
});






console.log("🔍 Variables de entorno:");
console.log("   JWT_SECRET:", process.env.JWT_SECRET ? "✅ Cargado" : "❌ No encontrado");
console.log("   MONGO_URI:", process.env.MONGO_URI ? "✅ Cargado" : "❌ No encontrado");


// Conectar a MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("🟢 Conectado a MongoDB"))
  .catch(err => {
    console.error("🔴 Error en la conexión a MongoDB:", err.message);
    process.exit(1); // Detiene el servidor si no se conecta a la base de datos
  });

  app.use((req, res, next) => {
    console.log(`🟡 Petición recibida: ${req.method} ${req.originalUrl}`);
    next();
  });

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Servidor en http://localhost:${PORT}`));

