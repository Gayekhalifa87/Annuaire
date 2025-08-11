const express = require('express');
const authenticateToken = require('../Middlewares/authMiddleware'); // Middleware pour vérifier les tokens JWT
const router = express.Router();
const {
  getHisto,
  getHistoById
} = require('../controllers/historiqueController');

router.use(authenticateToken); // Protège toutes les routes de ce fichier

router.get('/historiques', getHisto);
router.get('/historiques/:id', getHistoById);

module.exports = router;