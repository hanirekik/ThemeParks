import React, { useState } from "react";
import { View, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import { shows } from "../data/db";
import { useNavigation } from "@react-navigation/native";
import SearchBarComponent from "../components/searchbar";
import ShowListAll from "../components/showListAll";
import NoResults from "../components/noresults";

const ShowsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const navigation = useNavigation();

  const filteredShows = shows.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchBarContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
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