import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import axios from "axios";
import { attractions, shows } from "../data/db";
import Header from "../components/header";
import AttractionItem from "../components/attractionitem";
import ShowItem from "../components/showitem";

const getApiUrl = () => "http://192.168.1.17:3000/prediction";

const HomePage = () => {
  const router = useRouter();
  const [predic, setPredic] = useState([]);

  const fetchPredictionFromDB = async () => {
    try {
      const response = await axios.get(getApiUrl());
      // console.log("✅ Données récupérées :", response.data);

      // Regrouper les prédictions par name
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

      setPredic(groupedPredictions); // Met à jour le state avec l'objet regroupé
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des prédictions :", error);
      Alert.alert("Erreur", "Impossible de récupérer les prédictions.");
    }
  };

  useEffect(() => {
    fetchPredictionFromDB();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Header />

        <TouchableOpacity
          onPress={() => router.push("/pages/MapPage")}
          style={styles.mapButton}
        >
          <Text style={styles.mapButtonText}>View Map</Text>
        </TouchableOpacity>

        {/* Section Attractions Populaires */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Attractions</Text>
          <FlatList
            data={attractions.slice(0, 4)}
            renderItem={({ item }) => <AttractionItem item={item} />}
            keyExtractor={(item) => item.name}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.list}
          />
          <TouchableOpacity
            onPress={() => router.push("/pages/AttractionsPage")}
            style={styles.viewAllButton}
          >
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>



        {/* Section Spectacles Populaires */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Shows</Text>
          <FlatList
            data={shows.slice(0, 4)}
            renderItem={({ item }) => <ShowItem item={item} />}
            keyExtractor={(item) => item.name}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.list}
          />
          <TouchableOpacity
            onPress={() => router.push("/pages/ShowsPage")}
            style={styles.viewAllButton}
          >
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>


       {/* Section des Prédictions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Predicted Wait Times</Text>
        
        <FlatList
          data={Object.keys(predic)}
          renderItem={({ item }) => (
            <View style={styles.predictionItem}>
              <Text style={styles.predictionTitle}>🎢 {item}</Text>
              {predic[item].map((pred, index) => (
                <View key={index} style={styles.predictionDetail}>
                  <Text style={styles.predictionText}>📅 {new Date(pred.prediction_Date).toLocaleString()}</Text>
                  <Text style={styles.predictionText}>⏳ {pred.predicted_waitTime} min</Text>
                </View>
              ))}
            </View>
          )}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.list}
        />
        <TouchableOpacity
            onPress={() => router.push("/pages/PredictionPage")}
            style={styles.viewAllButton}
        >
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#4B0082",
  },
  list: {
    paddingHorizontal: 5,
  },
  viewAllButton: {
    marginTop: 15,
    alignSelf: "flex-end",
    padding: 12,
    backgroundColor: "#4B0082",
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  viewAllText: {
    color: "#fff",
    fontWeight: "bold",
  },
  mapButton: {
    backgroundColor: "#FF4500",
    padding: 12,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  mapButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default HomePage;