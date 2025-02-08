import React from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { attractions, shows } from "../data/db";
import Header from "../components/Header";
import AttractionItem from "../components/AttractionItem";
import ShowItem from "../components/ShowItem";
import Animated, { FadeIn, FadeInRight } from "react-native-reanimated";

const HomePage = () => {
  const router = useRouter();
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
});

export default HomePage;
