import React from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { attractions, shows } from "../data/db";
import Header from "../components/header";
import AttractionItem from "../components/attractionitem";
import ShowItem from "../components/showitem";

const HomePage = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
     <ScrollView style={styles.scrollView}>

      <Header />

      <TouchableOpacity
          onPress={() => router.push("/components/map")}
          style={styles.mapButton}
        >
          <Text style={styles.mapButtonText}>View Map</Text>
        </TouchableOpacity>


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
          onPress={() => router.push("/pages/attractions")}
          style={styles.viewAllButton}
        >
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

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
          onPress={() => router.push("/pages/shows")}
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