import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Icon } from "react-native-elements";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  requestNotificationPermissions,
  scheduleNotification,
} from "../services/NotificationService";

const AttractionListAll = ({ item }) => {
  const router = useRouter();
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
  const [globalNotificationsEnabled, setGlobalNotificationsEnabled] =
    useState(false);

  useEffect(() => {
    const loadGlobalNotificationPreference = async () => {
      const savedPreference = await AsyncStorage.getItem(
        "notificationsEnabled"
      );
      if (savedPreference !== null) {
        setGlobalNotificationsEnabled(JSON.parse(savedPreference));
      }
    };
    loadGlobalNotificationPreference();
  }, []);

  useEffect(() => {
    const loadNotificationPreference = async () => {
      if (!globalNotificationsEnabled) {
        setIsNotificationEnabled(false);
        return;
      }

      const savedPreference = await AsyncStorage.getItem(
        `notification_${item.id}`
      );
      if (savedPreference !== null) {
        setIsNotificationEnabled(savedPreference === "true");
      }
    };
    loadNotificationPreference();
  }, [item.id, globalNotificationsEnabled]);

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

    if (newPreference && item.waitTime < 20) {
      await scheduleNotification(item.name);
    }
  };

  return (
    <View style={styles.item}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <View style={styles.detailsContainer}>
          <View style={styles.waitStatusContainer}>
            {item.status === "Open" && (
              <>
                <Text style={styles.waitTime}>🕒 {item.waitTime} min</Text>
                <Text style={styles.separator}> • </Text>
              </>
            )}
            <Text
              style={[
                styles.status,
                { color: item.status === "Open" ? "#27ae60" : "#c0392b" },
              ]}
            >
              {item.status}
            </Text>
          </View>
        </View>
        <Text style={styles.lastUpdated}>Last Updated: {item.lastUpdated}</Text>
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
          } // Gray if disabled
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#f9f9f9",
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 15,
    marginRight: 20,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#34495e",
  },
  detailsContainer: {
    marginTop: 5,
  },
  waitStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  waitTime: {
    fontSize: 16,
    color: "#f39c12",
    marginRight: 5,
  },
  separator: {
    fontSize: 18,
    color: "#34495e",
    marginHorizontal: 10,
  },
  status: {
    fontSize: 16,
  },
  lastUpdated: {
    fontSize: 14,
    color: "#95a5a6",
  },
  bellIcon: {
    marginLeft: 10,
  },
});

export default AttractionListAll;
