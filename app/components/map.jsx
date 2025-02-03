import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

// Composant principal affichant la carte interactive de Disneyland Paris
const DisneylandMap = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  if (errorMsg) {
    Alert.alert("Erreur de localisation", errorMsg);
  }

  return (
    <View style={styles.container}>
      {/* Affichage de la carte avec un focus sur Disneyland Paris */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 48.872234, // Latitude de Disneyland Paris
          longitude: 2.775808, // Longitude de Disneyland Paris
          latitudeDelta: 0.01, // Zoom sur la latitude
          longitudeDelta: 0.01, // Zoom sur la longitude
        }}
      >
        {/* Marqueur représentant une attraction emblématique */}
        <Marker
          coordinate={{ latitude: 48.8738, longitude: 2.7758 }}
          title="Château de la Belle au Bois Dormant" // Nom du marqueur
          description="L'icône de Disneyland Paris" // Description affichée sous le titre
        />
        {/* Marqueur représentant la localisation de l'utilisateur */}
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

// Styles pour le composant
const styles = StyleSheet.create({
  container: {
    flex: 1, // Permet au composant d'occuper tout l'écran
  },
  map: {
    width: '100%', // La carte prend toute la largeur de l'écran
    height: '100%', // La carte prend toute la hauteur de l'écran
  },
});

export default DisneylandMap;

