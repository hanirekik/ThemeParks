import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";

const AttractionListAll = ({ item }) => {
  return (
    <View style={styles.item}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <View style={styles.detailsContainer}>
          <View style={styles.waitStatusContainer}>
            {item.status === "Open" && (
              <>
                <Text style={styles.waitTime}>🕒 {item.waitTime} min</Text>
                <Text style={styles.separator}> • </Text>
              </>
            )}
            <Text
              style={[
                styles.status,
                { color: item.status === "Open" ? "#27ae60" : "#c0392b" },
              ]}
            >
              {item.status}
            </Text>
          </View>
        </View>
        <Text style={styles.lastUpdated}>Last Updated: {item.lastUpdated}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#f9f9f9",
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 15,
    marginRight: 20,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#34495e",
  },
  detailsContainer: {
    marginTop: 5,
  },
  waitStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  waitTime: {
    fontSize: 16,
    color: "#f39c12",
    marginRight: 5,
  },
  separator: {
    fontSize: 18,
    color: "#34495e",
    marginHorizontal: 10,
  },
  status: {
    fontSize: 16,
  },
  lastUpdated: {
    fontSize: 14,
    color: "#95a5a6",
  },
});

export default AttractionListAll;
