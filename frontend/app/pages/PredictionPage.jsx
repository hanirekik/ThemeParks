import React, { useState, useEffect } from "react";
import {
  View,
  Alert,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Icon } from "react-native-elements";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import SearchBar from "../components/SearchPrediction";
import SortButtons from "../components/SortButtons";
import AttractionList from "../components/PredictionList";

import SearchBarComponent from "../components/SearchBar";
import { Ionicons } from "@expo/vector-icons";

const getApiUrl = () => "http://192.168.1.1:3000/prediction";

const PredictionListPage = () => {
  const [predictions, setPredictions] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const navigation = useNavigation();
  // const [mostFrequentDate, setMostFrequentDate] = useState("");

  useEffect(() => {
    fetchPredictionFromDB();
  }, []);

  const fetchPredictionFromDB = async () => {
    try {
      const response = await axios.get(getApiUrl());

      let dateOccurrences = {}; // Objet pour stocker les occurrences des dates

      // Regrouper les prédictions par name
      const groupedPredictions = response.data.reduce((acc, item) => {
        const predictionDate = new Date(item.prediction_Date);
        const year = predictionDate.getFullYear();
        const month = predictionDate.getMonth();

        // Compter les occurrences de chaque date
        const dateKey = item.prediction_Date;
        dateOccurrences[dateKey] = (dateOccurrences[dateKey] || 0) + 1;

        return acc;
      }, {});

      // Trouver la date avec le plus d'occurrences
      const mostFrequentDate = Object.keys(dateOccurrences).reduce((a, b) =>
        dateOccurrences[a] > dateOccurrences[b] ? a : b
      );

      console.log("📅 Date la plus fréquente :", mostFrequentDate);

      // Filtrer les prédictions pour ne garder que celles avec la date la plus fréquente
      const filteredPredictions = response.data.filter(
        (item) =>
          item.prediction_Date.split("T")[0] === mostFrequentDate.split("T")[0]
      );

      // Regrouper les prédictions filtrées par name
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

      setPredictions(finalGroupedPredictions); // Met à jour le state avec l'objet regroupé filtré
      // setMostFrequentDate(mostFrequentDate); // Stocker la date la plus fréquente
    } catch (error) {
      console.error(
        "❌ Erreur lors de la récupération des prédictions :",
        error
      );
      Alert.alert("Erreur", "Impossible de récupérer les prédictions.");
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
