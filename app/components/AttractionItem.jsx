import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import imageMap from "../utils/imageMap"; // Import the generated mapping

const AttractionItem = ({ item }) => {
  // Get the image from the mapping object
  const imageSource = imageMap[item.name] || imageMap["default"]; // Default image if not found

  return (
    <Animated.View entering={FadeInUp.duration(600)}>
      <TouchableOpacity style={styles.attractionItem}>
        <Image source={imageSource} style={styles.image} />
        <Text style={styles.name}>{item.name}</Text>
        <View style={styles.statusContainer}>
          <Text
            style={[
              styles.status,
              item.status === "CLOSED" && styles.closedStatus,
            ]}
          >
            {item.status}
          </Text>
          {item.status === "OPEN" && (
            <Text style={styles.waitTime}>{item.waitTime || "N/A"} min</Text>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  attractionItem: {
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 15,
    marginRight: 15,
    width: 190,
    height: 290,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 15,
    left: 15,
    right: 15,
  },
  status: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#008000",
  },
  closedStatus: {
    color: "#ff0000",
  },
  waitTime: {
    fontSize: 14,
    color: "#ff4500",
  },
});

export default AttractionItem;
