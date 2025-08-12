const express = require('express');
 const authenticateToken = require('../Middlewares/authMiddleware');  
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



router.get('/employes',  getAll);
router.get('/employes/:id', authenticateToken, getById);
router.get('/employes/email/:email', authenticateToken, getByEmail);
router.post('/employes', authenticateToken, create);
router.put('/employes/:id', authenticateToken, update);
router.delete('/employes/:id', authenticateToken, remove); 
router.patch('/employes/:id/role', authenticateToken, switchRole);



module.exports = router;