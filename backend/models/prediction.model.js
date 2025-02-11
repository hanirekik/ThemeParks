const mongoose = require('mongoose');

// Définition du schéma pour la collection "locations"
const predictionSchema = new mongoose.Schema({
  name: String,
  prediction_Date: Date,
  predicted_waitTime : Number
});

// Création du modèle basé sur le schéma
const Predictions = mongoose.model('predictions', predictionSchema);

module.exports = Predictions;
