import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { Icon } from "react-native-elements";
import SearchBarComponent from "../components/SearchBar";
import FilterBar from "../components/FilterButtons";
import AttractionListAll from "../components/AttractionListAll";
import SortModal from "../components/SortModal";
import NoResults from "../components/NoResults";
import { useNavigation } from "@react-navigation/native";

const AttractionsListPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [sortOption, setSortOption] = useState({ field: "name", order: "asc" });
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedField, setSelectedField] = useState("name");
  const [selectedOrder, setSelectedOrder] = useState("asc");
  const [attractions, setAttractions] = useState([]); // State to store fetched attractions
  const [isLoading, setIsLoading] = useState(true); // State to track loading status

  const navigation = useNavigation();

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://api.themeparks.wiki/v1/entity/e8d0207f-da8a-4048-bec8-117aa946b2c2/live"
        );
        const data = await response.json();

        // Filter only attractions (entityType === "ATTRACTION")
        const attractionsData = data.liveData.filter(
          (item) => item.entityType === "ATTRACTION"
        );

        // Update state with the fetched attractions
        setAttractions(attractionsData);
        setIsLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error("Error fetching data:", error);
        Alert.alert("Error", "Unable to fetch attractions data.");
        setIsLoading(false); // Set loading to false even if there's an error
      }
    };

    fetchData();
  }, []);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const applySort = () => {
    setSortOption({ field: selectedField, order: selectedOrder });
    setModalVisible(false);
  };

  // Filter and sort the attractions based on search query, filter, and sort options
  const filteredAttractions = attractions
    .filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesFilter =
        filter === "All" ||
        (filter === "Open" && item.queue?.STANDBY?.status === "OPERATING");
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortOption.field === "name") {
        // Sort by name
        if (sortOption.order === "asc") {
          return a.name.localeCompare(b.name);
        } else {
          return b.name.localeCompare(a.name);
        }
      } else if (sortOption.field === "waitTime") {
        // Sort by wait time
        const waitTimeA = a.queue?.STANDBY?.waitTime || 0;
        const waitTimeB = b.queue?.STANDBY?.waitTime || 0;
        if (sortOption.order === "asc") {
          return waitTimeA - waitTimeB;
        } else {
          return waitTimeB - waitTimeA;
        }
      }
      return 0;
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
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      ) : filteredAttractions.length === 0 ? (
        <NoResults searchQuery={searchQuery} />
      ) : (
        <FlatList
          data={filteredAttractions}
          renderItem={({ item }) => <AttractionListAll item={item} />}
          keyExtractor={(item) => item.id}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AttractionsListPage;
