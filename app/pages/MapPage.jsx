import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';

const DisneylandMap = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [attractions, setAttractions] = useState([]);
  const [selectedAttraction, setSelectedAttraction] = useState(null); // 🔹 Ajout du state

  // Fonction pour récupérer les temps d'attente des attractions
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

  // Demander la permission de localisation
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission de localisation refusée');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  // Récupérer les temps d'attente au chargement du composant
  useEffect(() => {
    fetchWaitTimes();
  }, []);

  if (errorMsg) {
    Alert.alert('Erreur de localisation', errorMsg);
  }

  return (
    <View style={styles.container}>
      {/* 🔹 Ajout d'une console.log pour débogage */}
      {console.log("Attraction sélectionnée:", selectedAttraction)}

      {/* 🔹 Barre d'information en haut de l'écran */}
      {selectedAttraction && (
        <View style={styles.infoBar}>
          <Text style={styles.infoText}>
            {/* {selectedAttraction.name} -  */}
            TdA: {selectedAttraction.queue?.STANDBY?.waitTime || "N/A"} min
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
        {/* Marqueurs des attractions */}
        {attractions.map((attraction) => (
          <Marker
            key={attraction.id}
            coordinate={{
              latitude: attraction.location?.latitude || 48.872234,
              longitude: attraction.location?.longitude || 2.775808,
            }}
            title={attraction.name}
            onPress={() => {
              setSelectedAttraction(attraction);
              console.log("Attraction cliquée:", attraction.name); // 🔹 Débogage
            }}
          />
        ))}

        {/* Marqueur pour la localisation de l'utilisateur */}
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
    top: 10, // 🔹 Descendre la barre pour qu'elle soit visible
    left: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 15, // 🔹 Augmenter l'espace
    borderRadius: 10,
    alignItems: 'center',
    zIndex: 10, // 🔹 Priorité d'affichage
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
