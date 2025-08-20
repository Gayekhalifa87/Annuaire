const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const redisClient = require('../config/redisClient');
const employeModel = require('../models/employeModel');
const db = require('../config/db')
const crypto = require('crypto')
const transporter = require('../config/mailer')
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


const resetToken = crypto.randomBytes(32).toString('hex');


const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Vérifier que l'employé existe
    const [rows] = await db.query('SELECT * FROM employes WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Cet email n'est pas enregistré." });
    }
    const employe = rows[0];

    // Supprimer le token existant si expiré
    await db.query(
      'UPDATE employes SET resetToken = NULL, resetTokenExpires = NULL WHERE id = ? AND resetTokenExpires <= NOW()',
      [employe.id]
    );

    // Générer un token aléatoire
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 heure

    // Enregistrer le token et la date d'expiration en DB
    await db.query('UPDATE employes SET resetToken = ?, resetTokenExpires = ? WHERE id = ?', [
      resetToken,
      expires,
      employe.id
    ]);

    // Lien de réinitialisation
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Envoyer l'email
    await transporter.sendMail({
      from: `"Annuaire" <${process.env.SMTP_USER}>`,
      to: employe.email,
      subject: 'Réinitialisation de votre mot de passe',
      html: `
        <p>Bonjour ${employe.prenom} ${employe.nom},</p>
        <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
        <p>Cliquez sur le lien ci-dessous pour créer un nouveau mot de passe :</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Ce lien expirera dans 1 heure.</p>
      `
    });

    res.status(200).json({ message: 'Un email de réinitialisation a été envoyé.' });

  } catch (error) {
    console.error('Erreur forgotPassword:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    // Vérifier que le token est valide et pas expiré
    const [rows] = await db.query(
      'SELECT * FROM employes WHERE resetToken = ? AND resetTokenExpires > NOW()',
      [token]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: 'Token invalide ou expiré.' });
    }

    const employe = rows[0];

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour le mot de passe et supprimer le token
    await db.query(
      'UPDATE employes SET password = ?, resetToken = NULL, resetTokenExpires = NULL WHERE id = ?',
      [hashedPassword, employe.id]
    );

    res.status(200).json({ message: 'Mot de passe mis à jour avec succès.' });

  } catch (error) {
    console.error('Erreur resetPassword:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};




module.exports = { login, getMe, logout, resetPassword, forgotPassword   };
  