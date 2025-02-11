const Prediction = require('../models/prediction.model');  // Importer le modèle Location

// Fonction pour obtenir toutes les attractions
exports.getLocations = async (req, res) => {
  try {
    const locations = await Prediction.find();  // Récupérer toutes les attractions
    console.log('donnée de predictions recupérée');
    res.json(locations);  // Retourner les attractions en JSON
  } catch (error) {
    console.error('Erreur lors de la récupération des predictions:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};
