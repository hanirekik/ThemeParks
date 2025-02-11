var Themeparks = require('themeparks');
const fs = require('fs');
const csvWriter = require('csv-writer').createObjectCsvWriter;

// Créer une instance de l'API
var api = new Themeparks.EntitiesApi();

// ID de l'entité que vous souhaitez obtenir
var entityId = 'e8d0207f-da8a-4048-bec8-117aa946b2c2';

// Appeler l'API pour obtenir les détails de l'entité
api.getEntityLiveData(entityId).then(function(data) {
    const donnee = JSON.stringify(data, null, 2)
//   console.log('API called successfully. Returned data: ' + donnee );

const liveData = data.liveData;
const Data = JSON.stringify(liveData, null, 2)
console.log('Live Data: ', Data);

const writer = csvWriter({
    path: 'output.csv',
    header: [
        {id: 'name', title: 'Name'},
        {id: 'entityType', title: 'Entity Type'},
        {id: 'status', title: 'Status'},
        {id: 'waitTime', title: 'Wait Time'},
        {id: 'lastUpdated', title: 'Last Updated'},
        {id: 'startTime', title: 'Start Time'},
        {id: 'endTime', title: 'End Time'}
    ]
});

const records = liveData.map(item => ({
    name: item.name,
    entityType: item.entityType,
    status: item.status,
    waitTime: item.queue && item.queue.STANDBY ? item.queue.STANDBY.waitTime : 'N/A',
    lastUpdated: item.lastUpdated,
    startTime: item.showtimes && item.showtimes.length > 0 ? item.showtimes.map(show => show.startTime).join(' / ') : 'N/A',
    endTime: item.showtimes && item.showtimes.length > 0 ? item.showtimes.map(show => show.endTime).join(' / ') : 'N/A'
}));

writer.writeRecords(records)
    .then(() => {
        console.log('CSV file was written successfully');
    })
    .catch(err => {
        console.error('Error writing CSV file', err);
    });

}, function(error) {
  console.error(error);
});