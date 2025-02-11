import React from "react";
import { View, Text } from "react-native";
import PredictionItem from "./PredictionItem";

const PredictionList = ({ predictions, filteredAttractions }) => {
  return (
    <View>
      {filteredAttractions.length === 0 ? (
        <Text
          style={{
            textAlign: "center",
            marginTop: 20,
            fontSize: 16,
            color: "gray",
          }}
        >
          No attraction found.
        </Text>
      ) : (
        filteredAttractions.map((attractionName) => (
          <View
            key={attractionName}
            style={{
              marginBottom: 20,
              padding: 20,
              backgroundColor: "#f9f9f9",
              borderRadius: 20,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.1,
              shadowRadius: 10,
              elevation: 6,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                marginBottom: 5,
                color: "#34495e",
              }}
            >
              {attractionName}
            </Text>
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
