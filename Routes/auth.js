const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const passport = require("passport");
const User = require("../Models/User"); 
require("dotenv").config();

const router = express.Router();



// Registro de usuario
router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;
    
    if (!first_name || !last_name || !email || !age || !password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email ya registrado" });

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({ first_name, last_name, email, age, password: hashedPassword,role: role || "user", });
    await newUser.save();

    res.status(201).json({ message: "Usuario registrado exitosamente" });
  } catch (error) {
    console.error("🔴 Error en /register:", error);
    res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Usuario no encontrado" });

    const isMatch = await bcrypt.compare(password, user.password); // 
    if (!isMatch) return res.status(400).json({ message: "Contraseña incorrecta" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h"
    });

    res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });
    res.json({ token });
  } catch (error) {
    console.error("🔴 Error en /login:", error);
    res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
});



// Obtener usuario actual (requiere autenticación)
router.get("/current", passport.authenticate("jwt", { session: false }), async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "No estás autenticado" });
    }

    res.json({ user: req.user });
  } catch (error) {
    console.error("🔴 Error en /current:", error);
    res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
});
const authorize = require("../middleware/auth");
router.get("/admin", passport.authenticate("jwt", { session: false }), authorize(["admin"]), (req, res) => {
  res.json({ message: "Bienvenido, administrador" });
});


module.exports = router;


