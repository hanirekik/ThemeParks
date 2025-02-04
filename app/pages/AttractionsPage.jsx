import React, { useState } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { Icon } from "react-native-elements";
import { attractions } from "../data/db";
import SearchBarComponent from "../components/searchbar";
import FilterBar from "../components/filterbuttons";
import AttractionListAll from "../components/AttractionListAll";
import SortModal from "../components/sortmodal";
import NoResults from "../components/noresults";
import { useNavigation } from "@react-navigation/native";

const AttractionsListPage = ({}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [sortOption, setSortOption] = useState({ field: "name", order: "asc" });
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedField, setSelectedField] = useState("name");
  const [selectedOrder, setSelectedOrder] = useState("asc");

  const navigation = useNavigation();

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const applySort = () => {
    setSortOption({ field: selectedField, order: selectedOrder });
    setModalVisible(false);
  };

  const filteredAttractions = attractions
    .filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesFilter =
        filter === "All" || (filter === "Open" && item.status === "Open");
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortOption.order === "asc") {
        return a[sortOption.field] > b[sortOption.field] ? 1 : -1;
      } else {
        return a[sortOption.field] < b[sortOption.field] ? 1 : -1;
      }
    });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchBarContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" type="feather" size={26} color="#687ed4" />
        </TouchableOpacity>
        <SearchBarComponent
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          navigation={navigation}
        />
      </View>
      <FilterBar
        filter={filter}
        setFilter={setFilter}
        toggleModal={toggleModal}
      />
      {filteredAttractions.length === 0 ? (
        <NoResults searchQuery={searchQuery} />
      ) : (
        <FlatList
          data={filteredAttractions}
          renderItem={({ item }) => <AttractionListAll item={item} />}
          keyExtractor={(item) => item.name}
          contentContainerStyle={styles.listContainer}
        />
      )}
      <SortModal
        isModalVisible={isModalVisible}
        toggleModal={toggleModal}
        selectedField={selectedField}
        setSelectedField={setSelectedField}
        selectedOrder={selectedOrder}
        setSelectedOrder={setSelectedOrder}
        applySort={applySort}
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
  listContainer: {
    paddingHorizontal: 15,
  },
  noResultsText: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#34495e",
    marginTop: 50,
    marginBottom: 10,
  },
  noResultsSubText: {
    fontSize: 16,
    color: "#7f8c8d",
  },
});

export default AttractionsListPage;