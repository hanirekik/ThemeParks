const Themeparks = require('themeparks');
const Attraction = require('./models/attraction');

// Connecter à MongoDB
require('./models/db'); // Initialise la connexion


// Créer une instance de l'API
const api = new Themeparks.EntitiesApi();

// ID de l'entité que vous souhaitez obtenir
const entityId = 'e8d0207f-da8a-4048-bec8-117aa946b2c2';

// Appeler l'API pour obtenir les détails de l'entité
api.getEntityLiveData(entityId).then(async function(data) {
    const liveData = data.liveData;

    if (!liveData || liveData.length === 0) {
        console.error('No live data available.');
        return;
    }

    // Traiter et enregistrer chaque attraction dans MongoDB
    for (const item of liveData) {
        const attractionData = {
            id: item.id,
            name: item.name,
            entityType: item.entityType,
            parkId: item.parkId,
            externalId: item.externalId,
            waitTime: item.queue && item.queue.STANDBY ? item.queue.STANDBY.waitTime : null,
            status: item.status,
            lastUpdated: item.lastUpdated ? new Date(item.lastUpdated) : null,
            showtimes: item.showtimes ? item.showtimes.map(show => ({
                startTime: new Date(show.startTime),
                endTime: new Date(show.endTime)
            })) : []
        };

        // Enregistrer dans MongoDB
        try {
            const attraction = new Attraction(attractionData);
            await attraction.save();
            console.log(`Attraction "${attraction.name}" saved to MongoDB.`);
        } catch (err) {
            console.error(`Error saving attraction "${attractionData.name}":`, err);
        }
    }
}, function(error) {
    console.error('Error fetching live data from API:', error);
});
