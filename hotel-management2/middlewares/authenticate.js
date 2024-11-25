// middlewares/authenticate.js

const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/config');

const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, jwtSecret);
    
    // Attach user data to request object
    req.user = decoded;
    next();  // Proceed to the next middleware or route handler
  } catch (err) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

module.exports = authenticate;
