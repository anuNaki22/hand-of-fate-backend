const authMiddleware = (req, res, next) => {
  // Add JWT or any other authentication logic here
  console.log('Auth Middleware');
  next();
};

module.exports = authMiddleware;
