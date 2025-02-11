const Location = require('../models/locations.model');  // Importer le modèle Location

// Fonction pour obtenir toutes les attractions
exports.getLocations = async (req, res) => {
  try {
    const locations = await Location.find();  // Récupérer toutes les attractions
    console.log('donnée recupérée');
    res.json(locations);  // Retourner les attractions en JSON
  } catch (error) {
    console.error('Erreur lors de la récupération des attractions:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};
