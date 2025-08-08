const express = require('express');
const router = express.Router();
const {
  getAll,
    getById,
    create,
    update,
    remove,
    switchRole
} = require('../controllers/employeController');



router.get('/employes', getAll);
router.get('/employes/:id', getById);
router.post('/employes', create);
router.put('/employes/:id', update);
router.delete('/employes/:id', remove); 
router.patch('/employes/:id/role', switchRole);

module.exports = router;