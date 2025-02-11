import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, { FadeIn, Layout } from "react-native-reanimated";

const Settings = () => {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedNotificationsEnabled = await AsyncStorage.getItem(
          "notificationsEnabled"
        );
        if (savedNotificationsEnabled !== null) {
          setNotificationsEnabled(JSON.parse(savedNotificationsEnabled));
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    };

    loadSettings();
  }, []);

  useEffect(() => {
    const saveSettings = async () => {
      try {
        await AsyncStorage.setItem(
          "notificationsEnabled",
          JSON.stringify(notificationsEnabled)
        );
      } catch (error) {
        console.error("Failed to save settings:", error);
      }
    };

    saveSettings();
  }, [notificationsEnabled]);

  return (
    <Animated.View style={styles.container} entering={FadeIn.duration(500)}>
      <Text style={styles.title}>Settings</Text>

      <Animated.View style={styles.settingRow} layout={Layout}>
        <Text style={styles.settingText}>Allow Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={(value) => setNotificationsEnabled(value)}
        />
      </Animated.View>

      <TouchableOpacity
        style={styles.manageRow}
        activeOpacity={0.7}
        onPress={() => router.push("/pages/AttractionsPage")}
      >
        <Text style={styles.manageText}>Manage the attractions</Text>
        <Text style={styles.arrow}>{">"}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.manageRow}
        activeOpacity={0.7}
        onPress={() => router.push("/pages/ShowsPage")}
      >
        <Text style={styles.manageText}>Manage the shows</Text>
        <Text style={styles.arrow}>{">"}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 20,
    color: "#4B0082",
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  settingText: {
    fontSize: 18,
  },
  manageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  manageText: {
    fontSize: 16,
    color: "#4B0082",
  },
  arrow: {
    fontSize: 18,
    color: "#4B0082",
  },
});

export default Settings;
