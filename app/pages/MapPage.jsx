import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert, LogBox } from "react-native";
import MapView from "react-native-maps";
import axios from "axios";
import LocationMarker from "../components/LocationMarker";
import AttractionMarker from "../components/AttractionMarker";
import InfoBar from "../components/InfoBar";

// 🔹 Ignore warnings concernant les clés uniques
LogBox.ignoreLogs(['Each child in a list should have a unique "key" prop.']);

const DisneylandMap = () => {
  const [location, setLocation] = useState(null);
  const [attractions, setAttractions] = useState([]);
  const [selectedAttraction, setSelectedAttraction] = useState(null);

  // URL de ton backend (Modifie si nécessaire)
  const API_URL = "http://192.168.1.17:3000/api/locations";

  // Fonction pour récupérer et fusionner les données
  const fetchAttractions = async () => {
    try {
      // 1️⃣ Récupération des temps d'attente (API externe)
      const waitTimesResponse = await axios.get(
        "https://api.themeparks.wiki/v1/entity/e8d0207f-da8a-4048-bec8-117aa946b2c2/live"
      );

      let liveAttractions = waitTimesResponse.data.liveData || [];

      // 2️⃣ Récupération des coordonnées depuis ton backend
      const dbResponse = await axios.get(API_URL);
      let dbAttractions = dbResponse.data || [];

      // 3️⃣ Fusionner les données : Associer les coordonnées aux attractions
      const mergedAttractions = liveAttractions.map((attraction, index) => {
        const dbAttraction = dbAttractions.find(
          (item) => item.name === attraction.name
        );
        return {
          ...attraction,
          latitude: dbAttraction ? dbAttraction.latitude : 0, // Défaut si absent
          longitude: dbAttraction ? dbAttraction.longitude : 0,
          uniqueKey: dbAttraction
            ? dbAttraction.id
            : `${attraction.name}-${index}`, // Utilisation de l'ID backend
        };
      });

      setAttractions(mergedAttractions);
    } catch (error) {
      console.error(
        "❌ Erreur lors de la récupération des attractions:",
        error
      );
      Alert.alert("Erreur", "Impossible de récupérer les attractions.");
    }
  };

  useEffect(() => {
    fetchAttractions();
  }, []);

  return (
    <View style={styles.container}>
      {/* 🔹 Barre d'information */}
      <InfoBar selectedAttraction={selectedAttraction} />

      {/* 🔹 Carte interactive */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 48.872234,
          longitude: 2.775808,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {/* 🔹 Marqueurs des attractions */}
        {attractions.map((attraction) => (
          <AttractionMarker
            key={attraction.uniqueKey}
            attraction={attraction}
            onPress={setSelectedAttraction}
          />
        ))}

        {/* 🔹 Marqueur de la localisation de l'utilisateur */}
        <LocationMarker location={location} />
      </MapView>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

export default DisneylandMap;
