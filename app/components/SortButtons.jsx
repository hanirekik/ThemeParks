import React from "react";
import { View, TouchableOpacity, Text } from "react-native";

const SortButtons = ({ handleSort, sortBy, sortOrder }) => {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
      <TouchableOpacity style={{ flex: 1, backgroundColor: "#007bff", padding: 10, marginHorizontal: 5, borderRadius: 5, alignItems: "center" }} onPress={() => handleSort("name")}>
        <Text style={{ color: "#fff", fontWeight: "bold" }}>
          Trier par Nom {sortBy === "name" ? (sortOrder === "asc" ? "🔼" : "🔽") : ""}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={{ flex: 1, backgroundColor: "#007bff", padding: 10, marginHorizontal: 5, borderRadius: 5, alignItems: "center" }} onPress={() => handleSort("waitTime")}>
        <Text style={{ color: "#fff", fontWeight: "bold" }}>
          Trier par Temps d'attente {sortBy === "waitTime" ? (sortOrder === "asc" ? "🔼" : "🔽") : ""}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SortButtons;
