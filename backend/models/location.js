const mongoose = require('mongoose');

const attractionLocationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null }
});

const Location = mongoose.model('Location', attractionLocationSchema);

module.exports = Location;
