const authorize = (roles = []) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ message: "No estás autenticado" });
      }
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Acceso denegado" });
      }
      next();
    };
  };

  module.exports = authorize;
