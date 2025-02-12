import React from "react";
import { Marker } from "react-native-maps";

// Composant pour afficher la localisation de l'utilisateur
const LocationMarker = ({ location }) => {
  if (!location) return null;

  return (
    <Marker
      coordinate={{
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      }}
      title="Vous êtes ici"
      pinColor="blue"
    />
  );
};

export default LocationMarker;
