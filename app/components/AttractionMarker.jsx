import React from 'react';
import { Marker } from 'react-native-maps';

// Composant pour afficher un marqueur d'attraction
const AttractionMarker = ({ attraction, onPress }) => {
  return (
    <Marker
      key={attraction.uniqueKey}
      coordinate={{
        latitude: attraction.latitude || 48.872234,
        longitude: attraction.longitude || 2.775808,
      }}
      title={attraction.name}
      onPress={() => onPress(attraction)}
    />
  );
};

export default AttractionMarker;
