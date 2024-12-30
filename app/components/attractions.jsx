import React, { useState } from "react";
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { SearchBar } from "react-native-elements";
import { attractions } from "../data/attractions";
import { SafeAreaView } from "react-native-safe-area-context";

const AttractionsList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [filter, setFilter] = useState("All");

  const handleCancel = () => {
    if (searchQuery.length > 0) {
      setSearchQuery("");
    }
    Keyboard.dismiss();
    setIsFocused(false);
  };

  const filteredAttractions = attractions.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      filter === "All" || (filter === "Open" && item.status === "Open");
    return matchesSearch && matchesFilter;
  });

  const renderAttraction = ({ item }) => (
    <View style={styles.item}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <View style={styles.detailsContainer}>
          {item.status === "Open" && (
            <Text style={styles.waitTime}>
              ⏳ Wait Time: {item.waitTime} min
            </Text>
          )}
          <Text
            style={[
              styles.status,
              { color: item.status === "Open" ? "#27ae60" : "#c0392b" },
            ]}
          >
            📍 Status: {item.status}
          </Text>
        </View>
        <Text style={styles.lastUpdated}>
          🕒 Last Updated: {item.lastUpdated}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchBarContainer}>
        <SearchBar
          key="unique-search-bar"
          placeholder="Search Attractions..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          onFocus={() => setIsFocused(true)}
          lightTheme
          round
          clearIcon={{ name: "close", type: "font-awesome" }}
          containerStyle={styles.searchBarContainerStyle}
          inputContainerStyle={styles.searchBarInputContainerStyle}
        />
        {isFocused && (
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Buttons */}
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
      </View>

      <FlatList
        data={filteredAttractions}
        renderItem={renderAttraction}
        keyExtractor={(item) => item.name}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: 10,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  searchBarContainerStyle: {
    flex: 1,
    backgroundColor: "transparent",
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  searchBarInputContainerStyle: {
    backgroundColor: "#f4f0ec",
    borderRadius: 10,
  },
  cancelButton: {
    marginLeft: 10,
    justifyContent: "center",
  },
  cancelButtonText: {
    color: "#007aff",
    fontSize: 16,
    fontWeight: "bold",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  filterButton: {
    backgroundColor: "#e0e0e0",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  filterButtonActive: {
    backgroundColor: "#007aff",
  },
  filterText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
  },
  listContainer: {
    paddingHorizontal: 15,
  },
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
    width: 90,
    height: 90,
    borderRadius: 15,
    marginRight: 20,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#34495e",
    marginBottom: 5,
  },
  detailsContainer: {
    marginTop: 5,
  },
  waitTime: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#f39c12",
    marginBottom: 5,
  },
  status: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  lastUpdated: {
    fontSize: 14,
    color: "#95a5a6",
  },
});

export default AttractionsList;
