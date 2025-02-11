const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const os = require("os");
const locationRoutes = require("./routes/locations.route"); // Importer les routes
const predictionRoutes = require("./routes/prediction.route"); // Importer les routes
require("dotenv").config(); // Charger les variables d'environnement

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connecté à MongoDB !"))
  .catch((error) => console.error("Erreur de connexion MongoDB:", error));

// Fonction pour obtenir l'adresse IP locale dynamique
function getLocalIPAddress() {
  const networkInterfaces = os.networkInterfaces();
  for (let interfaceName in networkInterfaces) {
    for (let iface of networkInterfaces[interfaceName]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "127.0.0.1";
}

// Utilisation des routes
app.use("/api", locationRoutes);
app.use("/prediction", predictionRoutes);

// Démarrer le serveur
const PORT = 3000;
const ipAddress = getLocalIPAddress();
app.listen(PORT, () => {
  console.log(`Le serveur tourne sur http://${ipAddress}:${PORT}`);
});
