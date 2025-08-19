const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const redisClient = require('../config/redisClient');
const employeModel = require('../models/employeModel');

const secretKey = process.env.JWT_SECRET || 'secret';

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const employe = await employeModel.GetEmployeeByEmail(email);
    if (!employe) {
      return res.status(404).json({ message: 'votre adresse email n existe pas ' });
    }

    if (employe.role === 'user') {
      return res.status(403).json({ message: "vous ne disposez pas d autorisations de connexion" });
    }

    const isPasswordValid = await bcrypt.compare(password, employe.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'votre mot de passe est incorrect' });
    }

    const token = jwt.sign(
      { id: employe.id, role: employe.role },
      secretKey,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Connexion réussie', token });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};


const getMe = async (req, res) => {
  try {
    // On récupère l'ID de l'utilisateur depuis le token
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token manquant' });

    const decoded = jwt.verify(token, secretKey);
    const userId = decoded.id;

    const employe = await employeModel.GetEmployeeById(userId);
    if (!employe) return res.status(404).json({ message: 'Utilisateur introuvable' });

    // Ne pas renvoyer le mot de passe
    const { password, ...userData } = employe;
    res.status(200).json(userData);
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Token invalide' });
  }
};



const logout = async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(400).json({ message: 'Aucun token fourni' });
  }

  try {
    // Décoder le token pour trouver sa date d'expiration
    const decoded = jwt.decode(token);
    const expInSeconds = decoded.exp - Math.floor(Date.now() / 1000);

    if (expInSeconds > 0) {
      // Stocker dans Redis avec expiration automatique
      await redisClient.setEx(`blacklist:${token}`, expInSeconds, 'true');
    }

    res.status(200).json({ message: 'Déconnexion réussie' });
  } catch (err) {
    res.status(400).json({ message: 'Le token n\'est plus valide, veuillez vous reconnecter' });
  }
};


module.exports = { login, getMe, logout };
  