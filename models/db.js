/*const mongoose = require('mongoose');

// Connexion à MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/themeparks', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Arrête l'application en cas d'erreur
    }
};

module.exports = connectDB;
*/

const mongoose = require("mongoose");

// URL de connexion à MongoDB
//const url = "mongodb://localhost:27017/themeparks"; // à modifier 
const url= "mongodb+srv://hani:themepark@clusterthemepark.uuwj3.mongodb.net/themeparks"

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

mongoose.set("strictQuery", true);

// Connexion à la base de données MongoDB
mongoose.connect(url, options)
    .then(() => console.log("Connexion à la base de données établie avec succès"))
    .catch((err) => console.error("Erreur lors de la connexion à la base de données :", err));

// Écoute des événements de la connexion MongoDB
mongoose.connection.on("connecting", () => console.log("Connection en cours..."));
mongoose.connection.on("connected", () => console.log("Connexion à la base de données réussie."));
mongoose.connection.on("error", (err) => console.error("Erreur de connexion :", err));
mongoose.connection.on("disconnected", () => console.log("Base de données déconnectée."));
mongoose.connection.on("reconnecting", () => console.log("Reconnexion à la base de données en cours..."));

// Export de la connexion à la base de données
module.exports = mongoose.connection;

