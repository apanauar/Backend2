const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Definición del esquema de usuario
const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: "user"
  }
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

// Middleware para encriptar la contraseña antes de guardar el usuario
userSchema.pre("save", async function(next) {
  if (this.isModified("password")) {
    this.password = bcrypt.hashSync(this.password, 10);
  }
  next();
});

// Creación del modelo
const User = mongoose.model("User", userSchema);
module.exports = User;

