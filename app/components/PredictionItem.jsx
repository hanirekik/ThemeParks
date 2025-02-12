import React from "react";
import { View, Text, StyleSheet } from "react-native";

const PredictionItem = ({ item }) => {
  return (
    <View style={styles.item}>
      <View style={styles.textContainer}>
        <View style={styles.timeContainer}>
          <Text style={styles.predictionTime}>
            {new Date(item.prediction_Date).toLocaleTimeString()}
          </Text>
          <Text style={styles.separator}> • </Text>
          <Text style={styles.waitTime}>🕒 {item.predicted_waitTime} min</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#f9f9f9", // Same background color as PredictionList
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
  },
  textContainer: {
    flex: 1,
  },
  timeContainer: {
    flexDirection: "row", // Arrange Date and Time side by side
    alignItems: "center",
  },
  predictionTime: {
    fontSize: 18,
    color: "#34495e",
  },
  separator: {
    fontSize: 18,
    color: "#34495e", // Matching color with the time text
    marginHorizontal: 5, // Add some spacing around the separator
  },
  waitTime: {
    fontSize: 16,
    color: "#f39c12",
  },
});

export default PredictionItem;
