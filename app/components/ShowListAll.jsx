import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ShowListAll = ({ item }) => {
  // Check if the item is a show and has showtimes
  const isShow = item.entityType === "SHOW";
  const showtimes = isShow && item.showtimes ? item.showtimes : [];

  return (
    <View style={styles.item}>
      <Text style={styles.name}>{item.name}</Text>
      {isShow && showtimes.length > 0 && (
        <Text style={styles.time}>
          🕒 Starts at: {new Date(showtimes[0].startTime).toLocaleTimeString()}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#f9f9f9",
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#34495e",
    marginBottom: 5,
  },
  time: {
    fontSize: 16,
    color: "#2980b9",
  },
});

export default ShowListAll;
