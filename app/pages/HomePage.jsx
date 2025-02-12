import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import axios from "axios";
import { attractions, shows } from "../data/db";
import Header from "../components/Header";
import AttractionItem from "../components/AttractionItem";
import ShowItem from "../components/ShowItem";
import Animated, {
  FadeIn,
  FadeInRight,
  FadeInUp,
} from "react-native-reanimated";

const getApiUrl = () => "http://192.168.1.49:3000/prediction";

const HomePage = () => {
  const router = useRouter();
  const [predic, setPredic] = useState([]);
  const [mostFrequentDate, setMostFrequentDate] = useState("");

  const fetchPredictionFromDB = async () => {
    try {
      const response = await axios.get(getApiUrl());

      let dateOccurrences = {}; // Object to store date occurrences

      // Group predictions by name
      const groupedPredictions = response.data.reduce((acc, item) => {
        const predictionDate = new Date(item.prediction_Date);
        const year = predictionDate.getFullYear();
        const month = predictionDate.getMonth();

        // Count occurrences of each date
        const dateKey = item.prediction_Date;
        dateOccurrences[dateKey] = (dateOccurrences[dateKey] || 0) + 1;

        return acc;
      }, {});

      // Find the most frequent date
      const mostFrequentDate = Object.keys(dateOccurrences).reduce((a, b) =>
        dateOccurrences[a] > dateOccurrences[b] ? a : b
      );

      console.log("📅 Most frequent date:", mostFrequentDate);

      // Filter predictions to keep only those with the most frequent date
      const filteredPredictions = response.data.filter(
        (item) =>
          item.prediction_Date.split("T")[0] === mostFrequentDate.split("T")[0]
      );

      // Group filtered predictions by name
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

      setPredic(finalGroupedPredictions); // Update state with the filtered grouped data
      setMostFrequentDate(mostFrequentDate); // Store the most frequent date
    } catch (error) {
      console.error("❌ Error fetching predictions:", error);
      Alert.alert("Error", "Unable to fetch predictions.");
    }
  };

  useEffect(() => {
    fetchPredictionFromDB();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView>
        <Animated.View entering={FadeIn.duration(800)}>
          <Header />
        </Animated.View>

        <Animated.View
          entering={FadeInRight.duration(800).delay(200)}
          style={styles.section}
        >
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
        </Animated.View>

        <Animated.View
          entering={FadeInRight.duration(800).delay(400)}
          style={styles.section}
        >
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
        </Animated.View>

        {/* Prediction Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Shortest wait time for {new Date(mostFrequentDate).toDateString()}
          </Text>

          <FlatList
            data={Object.keys(predic)}
            renderItem={({ item }) => (
              <View style={styles.predictionItem}>
                <Text style={styles.predictionTitle}>{item}</Text>
                {predic[item].map((pred, index) => (
                  <View key={index} style={styles.predictionDetail}>
                    <View style={styles.predictionRow}>
                      <Text style={styles.predictionText}>
                        🕒 {new Date(pred.prediction_Date).toLocaleTimeString()}
                      </Text>
                      <Text style={styles.predictionWaitTime}>
                        {pred.predicted_waitTime} min
                      </Text>
                    </View>
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
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#4B0082",
  },
  list: {
    paddingHorizontal: 5,
    paddingVertical: 10,
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

  // Prediction Item styles
  predictionItem: {
    backgroundColor: "#fafafa",
    borderRadius: 15,
    padding: 15,
    marginRight: 15,
    width: 190,
    height: 120,
    alignItems: "center",
    justifyContent: "space-between", // Distribute space between elements
    flexDirection: "column", // Ensure that the child elements stack vertically
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  predictionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  predictionDetail: {
    marginTop: "auto", // Pushes the prediction details to the bottom of the container
  },
  predictionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    width: "100%", // Ensures the row spans the full width of its container
  },
  predictionText: {
    fontSize: 14,
    color: "#555",
  },
  predictionWaitTime: {
    fontSize: 14,
    color: "red", // Color for wait time
  },
});

export default HomePage;
