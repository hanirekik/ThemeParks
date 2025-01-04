import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { attractions, shows } from "../data/db";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const HomePage = () => {
  const router = useRouter();

  const renderAttraction = ({ item }) => (
    <TouchableOpacity style={styles.attractionItem}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDetails}>{item.details}</Text>
        <View style={styles.statusContainer}>
          <Text style={styles.status}>{item.status}</Text>
          {item.status === "Open" && (
            <Text style={styles.waitTime}>{item.waitTime} min</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderShow = ({ item }) => (
    <TouchableOpacity style={styles.showItem}>
      <Text style={styles.showName}>{item.name}</Text>
      <Text style={styles.showTime}>Starts at: {item.time}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to Disneyland Paris!</Text>
        <Text style={styles.subTitle}>Your magical journey starts here ✨</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popular Attractions</Text>
        <FlatList
          data={attractions.slice(0, 4)}
          renderItem={renderAttraction}
          keyExtractor={(item) => item.name}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.list}
        />
        <TouchableOpacity
          onPress={() => router.push("/components/attractions")}
          style={styles.viewAllButton}
        >
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popular Shows</Text>
        <FlatList
          data={shows.slice(0, 4)}
          renderItem={renderShow}
          keyExtractor={(item) => item.name}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.list}
        />
        <TouchableOpacity
          onPress={() => router.push("/components/shows")}
          style={styles.viewAllButton}
        >
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#4B0082",
    padding: 25,
    borderRadius: 15,
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 5,
  },
  subTitle: {
    fontSize: 18,
    color: "#dcdcdc",
    fontFamily: "Verdana",
    textAlign: "center",
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
  attractionItem: {
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 15,
    marginRight: 15,
    width: 190,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  textContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  showItem: {
    backgroundColor: "#fafafa",
    borderRadius: 15,
    padding: 15,
    marginRight: 15,
    width: 190,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  itemDetails: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginTop: 5,
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    width: "100%",
  },
  status: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#008000",
  },
  waitTime: {
    fontSize: 14,
    color: "#ff4500",
  },
  showName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  showTime: {
    fontSize: 14,
    color: "#555",
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
});

export default HomePage;
