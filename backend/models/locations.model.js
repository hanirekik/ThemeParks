const mongoose = require('mongoose');

// Définition du schéma pour la collection "locations"
const locationSchema = new mongoose.Schema({
  name: String,
  latitude: Number,
  longitude: Number
});

// Création du modèle basé sur le schéma
const Location = mongoose.model('locations', locationSchema);

module.exports = Location;
