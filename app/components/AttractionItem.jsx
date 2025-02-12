import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

const AttractionItem = ({ item }) => (
  <Animated.View entering={FadeInUp.duration(600)}>
    <TouchableOpacity style={styles.attractionItem}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDetails}>{item.details}</Text>
        <View style={styles.statusContainer}>
          <Text style={styles.status}>{item.status}</Text>
          {item.status === "Open" && (
            <Text style={styles.waitTime}>{item.waitTime} min</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  </Animated.View>
);

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
  textContainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  itemDetails: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginTop: 3,
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    width: "100%",
  },
  status: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#008000",
  },
  waitTime: {
    fontSize: 14,
    color: "#ff4500",
  },
});

export default AttractionItem;
