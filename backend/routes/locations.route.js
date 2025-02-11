const express = require('express');
const locationController = require('../controllers/locations.controller');  // Importer le contrôleur

const router = express.Router();

// Route pour récupérer toutes les attractions
router.get('/locations', locationController.getLocations);

module.exports = router;
