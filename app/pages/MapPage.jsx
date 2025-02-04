import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, LogBox } from 'react-native';
import MapView from 'react-native-maps';
import axios from 'axios';
import LocationMarker from '../components/LocationMarker';
import AttractionMarker from '../components/AttractionMarker';
import InfoBar from '../components/InfoBar';

// Ignorer l'avertissement concernant la clé unique dans une liste
LogBox.ignoreLogs(['Each child in a list should have a unique "key" prop.']);

const DisneylandMap = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [attractions, setAttractions] = useState([]);
  const [selectedAttraction, setSelectedAttraction] = useState(null);

  // Fonction pour récupérer les données du backend, incluant la latitude et la longitude des attractions
  const getApiUrl = () => {
    return "http://192.168.1.17:3000/api/locations"; // Assure-toi que cette URL est correcte
  };

  const fetchWaitTimes = async () => {
    try {
      const response = await axios.get(
        'https://api.themeparks.wiki/v1/entity/e8d0207f-da8a-4048-bec8-117aa946b2c2/live'
      );
      setAttractions(response.data.liveData);
    } catch (error) {
      console.error("Erreur lors de la récupération des temps d'attente:", error);
      Alert.alert("Erreur", "Impossible de récupérer les temps d'attente.");
    }
  };

  const fetchAttractionsFromDB = async () => {
    try {
      const response = await axios.get(getApiUrl());
      setAttractions((prevAttractions) => {
        return prevAttractions.map((attraction, index) => {
          const dbAttraction = response.data.find(item => item.name === attraction.name);
          if (dbAttraction) {
            return {
              ...attraction,
              latitude: dbAttraction.latitude,
              longitude: dbAttraction.longitude,
              uniqueKey: `${attraction.name}-${index}`,
            };
          }
          return {
            ...attraction,
            uniqueKey: `${attraction.name}-${index}`,
          };
        });
      });
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des attractions depuis le backend :", error);
      Alert.alert("Erreur", "Impossible de récupérer les attractions.");
    }
  };

  useEffect(() => {
    fetchWaitTimes(); // Appel à l'API ThemePark
    fetchAttractionsFromDB(); // Appel au backend pour récupérer les coordonnées des attractions
  }, []);

  return (
    <View style={styles.container}>
      {/* 🔹 Barre d'information en haut de l'écran */}
      <InfoBar selectedAttraction={selectedAttraction} />

      {/* Affichage de la carte */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 48.872234,
          longitude: 2.775808,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {attractions.map((attraction) => (
          <AttractionMarker
            key={attraction.uniqueKey}
            attraction={attraction}
            onPress={setSelectedAttraction}
          />
        ))}

        {/* Afficher le marqueur de la localisation de l'utilisateur */}
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
    width: '100%',
    height: '100%',
  },
});

export default DisneylandMap;
