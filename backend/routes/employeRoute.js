const express = require('express');
const authenticateToken = require('../Middlewares/authMiddleware'); // Middleware pour vérifier les tokens JWT
const router = express.Router();
const {
  getAll,
    getById,
    getByEmail,
    create,
    update,
    remove,
    switchRole
} = require('../controllers/employeController');

router.use(authenticateToken); // Protège toutes les routes de ce fichier


router.get('/employes', getAll);
router.get('/employes/:id', getById);
router.get('/employes/email/:email', getByEmail);
router.post('/employes', create);
router.put('/employes/:id', update);
router.delete('/employes/:id', remove); 
router.patch('/employes/:id/role', switchRole);

module.exports = router;