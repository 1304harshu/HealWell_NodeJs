const jwt = require('jsonwebtoken');
const User = require('../../../../../Downloads/healWell_backend/HealWell_NodeJs/models/User');
const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).send({ message: 'Authentication token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      return res.status(403).send({ message: 'Invalid token' });
    }

    const dbUser = await User.findById(user.id);
    req.user = dbUser;
    next();
  });
};

module.exports = authenticateJWT;
