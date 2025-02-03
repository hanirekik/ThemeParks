import React from "react";
import { View, StyleSheet, ImageBackground } from "react-native";
import MapView, { Marker } from "react-native-maps";

// Importer l'image locale de la carte de Disneyland Paris
const disneylandMapImage = require("../../assets/images/disney_map.jpg");

// Données des attractions (exemple)
const attractions = [
  {
    id: 1,
    name: "Château de la Belle au Bois Dormant",
    latitude: 48.8738,
    longitude: 2.7758,
  },
  {
    id: 2,
    name: "Space Mountain",
    latitude: 48.8729,
    longitude: 2.7786,
  },
  {
    id: 3,
    name: "Pirates of the Caribbean",
    latitude: 48.8722,
    longitude: 2.7753,
  },
];

// Composant principal affichant la carte interactive de Disneyland Paris
const DisneylandMap = () => {
  return (
    <View style={styles.container}>
      {/* Affichage de l'image en arrière-plan */}
      <ImageBackground source={disneylandMapImage} style={styles.backgroundMap}>
        {/* Superposition des marqueurs des attractions */}
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
              key={attraction.id}
              coordinate={{
                latitude: attraction.latitude,
                longitude: attraction.longitude,
              }}
              title={attraction.name}
            />
          ))}
        </MapView>
      </ImageBackground>
    </View>
  );
};

// Styles pour le composant
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundMap: {
    flex: 1,
    resizeMode: "cover",
  },
  map: {
    flex: 1,
    backgroundColor: "transparent", // Assurer la transparence pour voir l'image de fond
  },
});

export default DisneylandMap;