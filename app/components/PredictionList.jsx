import React from "react";
import { View, Text, StyleSheet } from "react-native";
import PredictionItem from "./PredictionItem";

const PredictionList = ({ predictions, filteredAttractions }) => {
  return (
    <View style={styles.container}>
      {filteredAttractions.length === 0 ? (
        <Text style={styles.noAttractionText}>No attraction found.</Text>
      ) : (
        filteredAttractions.map((attractionName) => (
          <View key={attractionName} style={styles.attractionContainer}>
            <Text style={styles.attractionName}>{attractionName}</Text>
            {predictions[attractionName].map((item, index) => (
              <PredictionItem key={index} item={item} />
            ))}
          </View>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    marginTop: 10,
  },
  noAttractionText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "gray",
  },
  attractionContainer: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: "#f9f9f9", // Same background color as PredictionItem
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  attractionName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#34495e",
  },
});

export default PredictionList;
