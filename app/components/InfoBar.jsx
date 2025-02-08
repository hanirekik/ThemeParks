import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Composant pour afficher la barre d'information de l'attraction sélectionnée
const InfoBar = ({ selectedAttraction }) => {
  if (!selectedAttraction) return null;

  return (
    <View style={styles.infoBar}>
      <Text style={styles.infoText}>
        - TdA: {selectedAttraction.queue?.STANDBY?.waitTime || "N/A"} min
      </Text>
      <Text style={styles.infoTextSmall}>
        MàJ: {new Date(selectedAttraction.lastUpdated).toLocaleString()}
      </Text>
      <Text style={styles.infoTextSmall}>
        Type: {selectedAttraction.entityType || "N/A"}
      </Text>
      <Text style={styles.infoTextSmall}>
        Etat: {selectedAttraction.status || "N/A"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
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

export default InfoBar;
