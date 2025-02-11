const express = require('express');
const predictionController = require('../controllers/prediction.controller');  // Importer le contrôleur

const router = express.Router();

// Route pour récupérer toutes les attractions
router.get('/', predictionController.getLocations);

module.exports = router;
