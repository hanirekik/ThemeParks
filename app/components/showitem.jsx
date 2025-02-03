import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

const ShowItem = ({ item }) => (
  <Animated.View entering={FadeInUp.duration(600)}>
    <TouchableOpacity style={styles.showItem}>
      <Text style={styles.showName}>{item.name}</Text>
      <Text style={styles.showTime}>Starts at: {item.time}</Text>
    </TouchableOpacity>
  </Animated.View>
);

const styles = StyleSheet.create({
  showItem: {
    backgroundColor: "#fafafa",
    borderRadius: 15,
    padding: 15,
    marginRight: 15,
    width: 190,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  showName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  showTime: {
    fontSize: 14,
    color: "#555",
  },
});

export default ShowItem;
