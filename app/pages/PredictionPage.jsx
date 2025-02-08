import React, { useState, useEffect } from "react";
import { View, Alert, ScrollView } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import SearchBar from "../components/SearchPrediction";
import SortButtons from "../components/SortButtons";
import AttractionList from "../components/PredictionList";

const getApiUrl = () => "http://192.168.1.17:3000/prediction";

const PredictionListPage = () => {
  const [predictions, setPredictions] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const navigation = useNavigation();

  useEffect(() => {
    fetchPredictionFromDB();
  }, []);

  const fetchPredictionFromDB = async () => {
    try {
      const response = await axios.get(getApiUrl());
      const groupedPredictions = response.data.reduce((acc, item) => {
        if (!acc[item.name]) {
          acc[item.name] = [];
        }
        acc[item.name].push({
          prediction_Date: item.prediction_Date,
          predicted_waitTime: item.predicted_waitTime,
        });
        return acc;
      }, {});
      setPredictions(groupedPredictions);
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des prédictions :", error);
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
          predictions[a].reduce((sum, item) => sum + item.predicted_waitTime, 0) /
          predictions[a].length;
        const avgWaitTimeB =
          predictions[b].reduce((sum, item) => sum + item.predicted_waitTime, 0) /
          predictions[b].length;
        return sortOrder === "asc" ? avgWaitTimeA - avgWaitTimeB : avgWaitTimeB - avgWaitTimeA;
      });
    }

    return filteredAttractions;
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff", padding: 10 }}>
      <SearchBar searchQuery={searchQuery} handleSearch={handleSearch} navigation={navigation} />
      <SortButtons handleSort={handleSort} sortBy={sortBy} sortOrder={sortOrder} />
      <ScrollView style={{ paddingBottom: 20 }}>
        <AttractionList predictions={predictions} filteredAttractions={getSortedAndFilteredPredictions()} />
      </ScrollView>
    </View>
  );
};

export default PredictionListPage;
