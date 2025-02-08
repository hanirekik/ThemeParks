import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // Icône de retour

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
    <View style={styles.container}>
      {/* Barre de recherche avec flèche de retour */}
      <View style={styles.searchContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <TextInput
          style={styles.searchBar}
          placeholder="Rechercher une attraction..."
          onChangeText={handleSearch}
          value={searchQuery}
        />
      </View>

      {/* Boutons de tri */}
      <View style={styles.sortButtons}>
        <TouchableOpacity style={styles.button} onPress={() => handleSort("name")}>
          <Text style={styles.buttonText}>
            Trier par Nom {sortBy === "name" ? (sortOrder === "asc" ? "🔼" : "🔽") : ""}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handleSort("waitTime")}>
          <Text style={styles.buttonText}>
            Trier par Temps d'attente {sortBy === "waitTime" ? (sortOrder === "asc" ? "🔼" : "🔽") : ""}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Liste des attractions */}
      <ScrollView style={styles.listContainer}>
        {getSortedAndFilteredPredictions().length === 0 ? (
          <Text style={styles.emptyText}>Aucune attraction trouvée</Text>
        ) : (
          getSortedAndFilteredPredictions().map((attractionName) => (
            <View key={attractionName} style={styles.attractionContainer}>
              <Text style={styles.attractionName}>{attractionName}</Text>
              {predictions[attractionName].map((item, index) => (
                <View key={index} style={styles.predictionItem}>
                  <Text style={styles.predictionText}>
                    📅 {new Date(item.prediction_Date).toLocaleDateString()} - ⏳ {item.predicted_waitTime} min
                  </Text>
                </View>
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  backButton: {
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  sortButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  button: {
    flex: 1,
    backgroundColor: "#007bff",
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "gray",
  },
  attractionContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  attractionName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  predictionItem: {
    backgroundColor: "#e3e3e3",
    padding: 8,
    borderRadius: 5,
    marginTop: 5,
  },
  predictionText: {
    fontSize: 14,
    color: "#444",
  },
});

export default PredictionListPage;
