import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Icon } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import SearchBarComponent from "../components/SearchBar";
import ShowListAll from "../components/ShowListAll";
import NoResults from "../components/NoResults";

const ShowsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await fetch(
          "https://api.themeparks.wiki/v1/entity/e8d0207f-da8a-4048-bec8-117aa946b2c2/live"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setShows(data.liveData || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
  }, []);

  // Filter only shows and apply search query
  const filteredShows = shows
    .filter((item) => item.entityType === "SHOW") // Filter only shows
    .filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#687ed4" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Error: {error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchBarContainer}>
        <TouchableOpacity onPress={navigation.goBack}>
          <Icon name="arrow-left" type="feather" size={26} color="#687ed4" />
        </TouchableOpacity>
        <SearchBarComponent
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isFocused={isFocused}
          setIsFocused={setIsFocused}
          navigation={navigation}
        />
      </View>
      {filteredShows.length === 0 ? (
        <NoResults searchQuery={searchQuery} />
      ) : (
        <FlatList
          data={filteredShows}
          renderItem={({ item }) => <ShowListAll item={item} />}
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
  listContainer: {
    paddingHorizontal: 15,
  },
});

export default ShowsPage;
