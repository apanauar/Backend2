const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const User = require("../Models/User"); 

// Configuración de las opciones para JWT
const opts = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    (req) => {
      return req.cookies.token; 
    }
  ]),
  secretOrKey: process.env.JWT_SECRET 
};

// Estrategia JWT
passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    
    const user = await User.findById(jwt_payload.id);
    if (user) {
      return done(null, user); 
    } else {
      return done(null, false); 
    }
  } catch (error) {
    return done(error, false); 
  }
}));

module.exports = passport;

