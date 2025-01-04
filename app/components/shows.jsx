import React, { useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Keyboard,
  Image,
} from "react-native";
import { SearchBar, Icon } from "react-native-elements";
import { shows } from "../data/db";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

const ShowsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const navigation = useNavigation();

  const handleCancel = () => {
    if (searchQuery.length > 0) {
      setSearchQuery("");
    }
    Keyboard.dismiss();
    setIsFocused(false);
  };

  const filteredShows = shows.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderShow = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.time}>🎭 Show starts at {item.time}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchBarContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" type="feather" size={26} color="#687ed4" />
        </TouchableOpacity>
        <SearchBar
          placeholder="Search Shows..."
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
      {filteredShows.length === 0 ? (
        <View style={{ alignItems: "center" }}>
          <Image
            source={require("../../assets/images/no_result.webp")}
            style={{ width: 200, height: 200 }}
          />
          <Text style={styles.noResultsText}>No results found!</Text>
          <Text style={styles.noResultsSubText}>
            There are 0 results for "{searchQuery}"
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredShows}
          renderItem={renderShow}
          keyExtractor={(item) => item.name}
          contentContainerStyle={styles.listContainer}
        />
      )}
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
    color: "#687ed4",
    fontSize: 16,
    fontWeight: "bold",
  },
  listContainer: {
    paddingHorizontal: 15,
  },
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

export default ShowsPage;
