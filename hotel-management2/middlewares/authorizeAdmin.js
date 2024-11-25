// middlewares/authorizeAdmin.js

const authorizeAdmin = (req, res, next) => {
    if (!req.user || !req.user.roles.includes('admin')) {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();  // User is authorized, proceed to the next middleware or route handler
  };
  
  module.exports = authorizeAdmin;
  