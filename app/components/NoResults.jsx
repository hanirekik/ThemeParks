// components/NoResults.js
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const NoResults = ({ searchQuery }) => (
  <View style={styles.container}>
    <Image
      source={require("../../assets/images/no_result.webp")}
      style={styles.image}
    />
    <Text style={styles.noResultsText}>No results found!</Text>
    <Text style={styles.noResultsSubText}>
      There are 0 results for "{searchQuery}"
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#34495e",
    marginTop: 10,
  },
  noResultsSubText: {
    fontSize: 14,
    color: "#7f8c8d",
    marginTop: 5,
  },
});

export default NoResults;
