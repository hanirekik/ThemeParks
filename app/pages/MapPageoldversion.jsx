import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Text, LogBox } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';

// Ignorer l'avertissement concernant la clé unique dans une liste
LogBox.ignoreLogs(['Each child in a list should have a unique "key" prop.']);

const DisneylandMap = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [attractions, setAttractions] = useState([]);
  const [selectedAttraction, setSelectedAttraction] = useState(null);

  // Fonction pour récupérer les données du backend, incluant la latitude et la longitude des attractions
  const getApiUrl = () => {
    return "http://192.168.1.17:3000/api/locations"; 
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
      {selectedAttraction && (
        <View style={styles.infoBar}>
          <Text style={styles.infoText}>
            - TdA: {selectedAttraction.queue?.STANDBY?.waitTime || "N/A"} min
          </Text>
          <Text style={styles.infoTextSmall}>
            MàJ: {new Date(selectedAttraction.lastUpdated).toLocaleString()}
          </Text>
        </View>
      )}

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
          <Marker
            key={attraction.uniqueKey}
            coordinate={{
              latitude: attraction.latitude || 48.872234,
              longitude: attraction.longitude || 2.775808,
            }}
            title={attraction.name}
            onPress={() => setSelectedAttraction(attraction)}
          />
        ))}

        {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Vous êtes ici"
            pinColor="blue"
          />
        )}
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
  infoBar: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    zIndex: 10,
  },
  infoText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoTextSmall: {
    color: 'white',
    fontSize: 14,
  },
});

export default DisneylandMap;
