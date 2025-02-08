import React from "react";
import { View, Text } from "react-native";

const PredictionItem = ({ item }) => {
  return (
    <View style={{ backgroundColor: "#e3e3e3", padding: 8, borderRadius: 5, marginTop: 5 }}>
      <Text style={{ fontSize: 14, color: "#444" }}>
        📅 {new Date(item.prediction_Date).toLocaleDateString()} - ⏳ {item.predicted_waitTime} min
      </Text>
    </View>
  );
};

export default PredictionItem;
