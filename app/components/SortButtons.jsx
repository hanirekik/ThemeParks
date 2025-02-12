import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

const SortButtons = ({ handleSort, sortBy, sortOrder }) => {
  return (
    <View style={styles.container}>
      <SortButton
        label="Sort by Name"
        isActive={sortBy === "name"}
        sortOrder={sortOrder}
        onPress={() => handleSort("name")}
      />
      <SortButton
        label="Sort by Wait Time"
        isActive={sortBy === "waitTime"}
        sortOrder={sortOrder}
        onPress={() => handleSort("waitTime")}
      />
    </View>
  );
};

// ✅ Extracted SortButton as a reusable component
const SortButton = ({ label, isActive, sortOrder, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>
        {label} {isActive ? (sortOrder === "asc" ? "🔼" : "🔽") : ""}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-start", // Align buttons to the left
    marginBottom: 10,
    paddingHorizontal: 10, // Add some padding to the sides
  },
  button: {
    width: 140,
    paddingVertical: 12,
    backgroundColor: "#687ed4",
    borderRadius: 40,
    alignItems: "center",
    marginHorizontal: 5, // Reduce margin between buttons
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5, // For Android shadow effect
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});

export default SortButtons;
