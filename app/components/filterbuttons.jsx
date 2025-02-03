import React from "react";
import { View, TouchableOpacity, Text } from "react-native";

const FilterBar = ({ filter, setFilter, toggleModal }) => {
  return (
    <View style={styles.filterContainer}>
      <TouchableOpacity
        style={[
          styles.filterButton,
          filter === "All" && styles.filterButtonActive,
        ]}
        onPress={() => setFilter("All")}
      >
        <Text style={styles.filterText}>All</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.filterButton,
          filter === "Open" && styles.filterButtonActive,
        ]}
        onPress={() => setFilter("Open")}
      >
        <Text style={styles.filterText}>Open</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.dropdownContainer} onPress={toggleModal}>
        <Text style={styles.dropdownText}>Sort ▾</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  filterButton: {
    backgroundColor: "#e0e0e0",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
  },
  filterButtonActive: {
    backgroundColor: "#687ed4",
  },
  filterText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
  },
  dropdownContainer: {
    marginLeft: "auto",
  },
  dropdownText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#687ed4",
  },
};

export default FilterBar;
