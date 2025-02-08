import React from "react";
import { View, Text } from "react-native";
import PredictionItem from "./PredictionItem";

const PredictionList = ({ predictions, filteredAttractions }) => {
  return (
    <View>
      {filteredAttractions.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 20, fontSize: 16, color: "gray" }}>Aucune attraction trouvée</Text>
      ) : (
        filteredAttractions.map((attractionName) => (
          <View key={attractionName} style={{ marginBottom: 15, padding: 10, backgroundColor: "#f8f9fa", borderRadius: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 5, color: "#333" }}>{attractionName}</Text>
            {predictions[attractionName].map((item, index) => (
              <PredictionItem key={index} item={item} />
            ))}
          </View>
        ))
      )}
    </View>
  );
};

export default PredictionList;
