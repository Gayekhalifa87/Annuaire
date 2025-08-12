const jwt = require('jsonwebtoken');
const redisClient = require('../config/redisClient');

const secretKey = process.env.JWT_SECRET || 'secret';

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token manquant' });
  }

  try {
    // Vérifier dans Redis si le token est blacklisté
    const isBlacklisted = await redisClient.get(`blacklist:${token}`);
    if (isBlacklisted) {
      return res.status(403).json({ message: 'Token invalide ou expiré' });
    }

    // Vérifier la validité du token
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token invalide' });
  }
};

module.exports = authenticateToken;


