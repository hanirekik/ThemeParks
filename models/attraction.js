const mongoose = require('mongoose');

// Définir le schéma des données
const attractionSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    entityType: { type: String, required: true },
    parkId: { type: String, required: false },
    externalId: { type: String, required: false },
    waitTime: { type: Number, default: null },
    status: { type: String, required: true },
    lastUpdated: { type: Date, default: Date.now },
    showtimes: {
        type: [
            {
                startTime: { type: Date },
                endTime: { type: Date }
            }
        ],
        default: null // Permet d'accepter null comme valeur
    }
});

// Créer le modèle
const Attraction = mongoose.model('Attraction', attractionSchema);

module.exports = Attraction;
