import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as Updates from "expo-updates";

const RefreshButton = () => {
  const navigation = useNavigation();

  const handleRefresh = async () => {
    try {
      // Vérifie si Expo Updates est disponible
      if (Updates?.reloadAsync) {
        console.log("🔄 Rechargement de l'application via Expo Updates...");
        await Updates.reloadAsync(); // Recharge l'application
      } else {
        console.log("🔄 Rafraîchissement via navigation...");
        navigation.replace("DisneylandMap"); // Recharge l'écran actuel
      }
    } catch (error) {
      console.error("❌ Erreur lors du rechargement :", error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleRefresh}>
        <Text style={styles.text}>🔄 Actualiser</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "white",
    borderRadius: 50,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default RefreshButton;
