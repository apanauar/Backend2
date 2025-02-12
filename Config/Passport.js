const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const User = require("../Models/user"); // Asegúrate de que la ruta sea correcta

// Configuración de las opciones para JWT
const opts = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    (req) => {
      return req.cookies.token; // Cambia 'token' por el nombre de tu cookie
    }
  ]),
  secretOrKey: process.env.JWT_SECRET // Asegúrate de que tu secreto esté en las variables de entorno
};

// Estrategia JWT
passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    // Busca el usuario en la base de datos usando el ID del payload
    const user = await User.findById(jwt_payload.id);
    if (user) {
      return done(null, user); // Usuario encontrado
    } else {
      return done(null, false); // Usuario no encontrado
    }
  } catch (error) {
    return done(error, false); // Manejo de errores
  }
}));

module.exports = passport;

