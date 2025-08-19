const express = require('express');
 const authenticateToken = require('../Middlewares/authMiddleware');  
const router = express.Router();
const {
  getAll,
    getById,
    getByEmail,
    create,
    changePassword, 
    update,
    remove,
    switchRole,
    searchAdvanced,
    getAllDirections
} = require('../controllers/employeController');



router.get('/employes',  getAll);
// Recherche par nom, prénom, service ou IP
router.get('/employes/search', searchAdvanced);  

router.get('/employes/directions', getAllDirections);

router.get('/employes/:id', getById);

router.get('/employes/email/:email', getByEmail);

router.post('/employes', authenticateToken, create);
router.put('/employes/:id', authenticateToken, update);
// route dans employeeRoutes.js
router.put('/employes/:id/password', authenticateToken, changePassword);

router.delete('/employes/:id', authenticateToken, remove); 
router.patch('/employes/:id/role',authenticateToken, switchRole);

module.exports = router;