import React, { useState, useEffect } from "react";
import {
  View,
  Alert,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Text,
} from "react-native";
import { Icon } from "react-native-elements";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import SearchBarComponent from "../components/SearchBar";
import SortButtons from "../components/SortButtons";
import AttractionList from "../components/PredictionList";

const getApiUrl = () => "http://192.168.1.49:3000/prediction";

const PredictionListPage = () => {
  const [predictions, setPredictions] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [mostFrequentDate, setMostFrequentDate] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    fetchPredictionFromDB();
  }, []);

  const fetchPredictionFromDB = async () => {
    try {
      const response = await axios.get(getApiUrl());

      let dateOccurrences = {};

      response.data.forEach((item) => {
        const dateKey = item.prediction_Date.split("T")[0];
        dateOccurrences[dateKey] = (dateOccurrences[dateKey] || 0) + 1;
      });

      const mostFrequentDate = Object.keys(dateOccurrences).reduce((a, b) =>
        dateOccurrences[a] > dateOccurrences[b] ? a : b
      );

      console.log("📅 Most frequent date:", mostFrequentDate);
      setMostFrequentDate(mostFrequentDate);

      const filteredPredictions = response.data.filter(
        (item) => item.prediction_Date.split("T")[0] === mostFrequentDate
      );

      const finalGroupedPredictions = filteredPredictions.reduce(
        (acc, item) => {
          if (!acc[item.name]) {
            acc[item.name] = [];
          }
          acc[item.name].push({
            prediction_Date: item.prediction_Date,
            predicted_waitTime: item.predicted_waitTime,
          });
          return acc;
        },
        {}
      );

      setPredictions(finalGroupedPredictions);
    } catch (error) {
      console.error("❌ Error fetching predictions:", error);
      Alert.alert("Error", "Unable to retrieve predictions.");
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query.toLowerCase());
  };

  const handleSort = (criteria) => {
    if (sortBy === criteria) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(criteria);
      setSortOrder("asc");
    }
  };

  const getSortedAndFilteredPredictions = () => {
    let filteredAttractions = Object.keys(predictions).filter((name) =>
      name.toLowerCase().includes(searchQuery)
    );

    if (sortBy === "name") {
      filteredAttractions.sort((a, b) =>
        sortOrder === "asc" ? a.localeCompare(b) : b.localeCompare(a)
      );
    } else if (sortBy === "waitTime") {
      filteredAttractions.sort((a, b) => {
        const avgWaitTimeA =
          predictions[a].reduce(
            (sum, item) => sum + item.predicted_waitTime,
            0
          ) / predictions[a].length;
        const avgWaitTimeB =
          predictions[b].reduce(
            (sum, item) => sum + item.predicted_waitTime,
            0
          ) / predictions[b].length;
        return sortOrder === "asc"
          ? avgWaitTimeA - avgWaitTimeB
          : avgWaitTimeB - avgWaitTimeA;
      });
    }

    return filteredAttractions;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.sectionTitle}>
        Shortest wait time for{" "}
        {mostFrequentDate
          ? new Date(mostFrequentDate).toDateString()
          : "Loading..."}
      </Text>
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
      <SortButtons
        handleSort={handleSort}
        sortBy={sortBy}
        sortOrder={sortOrder}
      />
      <ScrollView style={{ paddingBottom: 20 }}>
        <AttractionList
          predictions={predictions}
          filteredAttractions={getSortedAndFilteredPredictions()}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
    color: "#333",
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

export default PredictionListPage;
