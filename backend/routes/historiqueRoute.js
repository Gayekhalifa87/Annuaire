const express = require('express');
const router = express.Router();
const {
  getHisto,
  getHistoById
} = require('../controllers/historiqueController');


router.get('/historiques', getHisto);
router.get('/historiques/:id', getHistoById);

module.exports = router;