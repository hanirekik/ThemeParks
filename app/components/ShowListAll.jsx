import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Icon } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { scheduleNotification } from "../services/NotificationService";

const ShowListAll = ({ item }) => {
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
  const [globalNotificationsEnabled, setGlobalNotificationsEnabled] =
    useState(false);

  // Check if the item is a show and has showtimes
  const isShow = item.entityType === "SHOW";
  const showtimes = isShow && item.showtimes ? item.showtimes : [];

  useEffect(() => {
    const loadPreferences = async () => {
      const savedGlobalPref = await AsyncStorage.getItem(
        "notificationsEnabled"
      );
      if (savedGlobalPref !== null) {
        setGlobalNotificationsEnabled(JSON.parse(savedGlobalPref));
      } else {
        // Default to true if no preference is saved
        setGlobalNotificationsEnabled(true);
      }

      const savedNotification = await AsyncStorage.getItem(
        `notification_${item.id}`
      );
      if (savedNotification !== null) {
        setIsNotificationEnabled(savedNotification === "true");
      }
    };

    loadPreferences();
  }, [item.id]);

  const toggleNotification = async () => {
    if (!globalNotificationsEnabled) {
      Alert.alert(
        "Notifications Disabled",
        "Please enable notifications in Settings to receive alerts.",
        [{ text: "Ok" }]
      );
      return;
    }

    const newPreference = !isNotificationEnabled;
    setIsNotificationEnabled(newPreference);
    await AsyncStorage.setItem(
      `notification_${item.id}`,
      JSON.stringify(newPreference)
    );

    if (newPreference) {
      // Schedule notification 30 minutes before the show starts
      if (isShow && showtimes.length > 0) {
        const showStartTime = new Date(showtimes[0].startTime);
        const notificationTime = new Date(
          showStartTime.getTime() - 30 * 60 * 1000
        ); // 30 minutes before

        await scheduleNotification(
          item.name,
          false, // isFastPass (false for shows)
          (notificationTime - new Date()) / 1000 // Time to notification in seconds
        );

        Alert.alert(
          "No coordinates for this show",
          `You will be notified 30 minutes before the show starts at ${showStartTime.toLocaleTimeString()}.`
        );
      }
    } else {
      // Disable notifications
      Alert.alert(
        "Notification Disabled",
        "You will no longer receive notifications for this show."
      );
    }
  };

  return (
    <View style={styles.item}>
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.name}</Text>
        {isShow && showtimes.length > 0 && (
          <Text style={styles.time}>
            🕒 Starts at:{" "}
            {new Date(showtimes[0].startTime).toLocaleTimeString()}
          </Text>
        )}
      </View>
      <TouchableOpacity onPress={toggleNotification} style={styles.bellIcon}>
        <Icon
          name={isNotificationEnabled ? "bell" : "bell-off"}
          type="feather"
          size={24}
          color={
            globalNotificationsEnabled
              ? isNotificationEnabled
                ? "#f39c12"
                : "#95a5a6"
              : "#d3d3d3"
          }
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#f9f9f9",
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textContainer: {
    flex: 1, // Take up remaining space
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#34495e",
    marginBottom: 5,
  },
  time: {
    fontSize: 16,
    color: "#2980b9",
  },
  bellIcon: {
    marginLeft: 10,
  },
});

export default ShowListAll;
