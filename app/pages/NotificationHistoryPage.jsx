import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import {
  getNotificationHistory,
  clearNotificationHistory,
} from "../services/NotificationService";
import { useFocusEffect } from "@react-navigation/native";
import Animated, {
  FadeIn,
  FadeInRight,
  FadeInDown,
  FadeOutUp,
} from "react-native-reanimated";

const NotificationHistory = () => {
  const router = useRouter();
  const [history, setHistory] = useState([]);

  const loadHistory = async () => {
    const savedHistory = await getNotificationHistory();
    setHistory(savedHistory);
  };

  useFocusEffect(
    React.useCallback(() => {
      loadHistory();
    }, [])
  );

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(
      async (notification) => {
        const newNotification = {
          title: notification.request.content.title,
          body: notification.request.content.body,
          timestamp: new Date().toISOString(),
        };

        const updatedHistory = [newNotification, ...history];
        await AsyncStorage.setItem(
          "notificationHistory",
          JSON.stringify(updatedHistory)
        );

        setHistory(updatedHistory);
      }
    );

    return () => {
      subscription.remove();
    };
  }, [history]);

  const handleClearHistory = async () => {
    await clearNotificationHistory();
    setHistory([]);
  };

  return (
    <View style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Animated.View entering={FadeIn.duration(800)}>
          <Text style={styles.title}>Notification History</Text>
        </Animated.View>
        <Animated.View entering={FadeInRight.duration(800).delay(200)}>
          <TouchableOpacity onPress={handleClearHistory}>
            <View style={styles.clearButtonContainer}>
              <Text style={styles.clearButtonText}>Clear</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {history.length === 0 ? (
        <Animated.Text
          style={styles.emptyText}
          entering={FadeInDown.duration(800)}
        >
          No notifications received yet.
        </Animated.Text>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Animated.View
              style={styles.notificationItem}
              entering={FadeInDown.duration(800)}
              exiting={FadeOutUp.duration(800)}
            >
              <Text style={styles.notificationTitle}>{item.title}</Text>
              <Text style={styles.notificationBody}>{item.body}</Text>
              <Text style={styles.notificationTimestamp}>
                {new Date(item.timestamp).toLocaleString()}
              </Text>
            </Animated.View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginTop: 30,
    marginBottom: 20,
    fontWeight: "bold",
    color: "#4B0082",
  },
  emptyText: {
    fontSize: 16,
    color: "#95a5a6",
    textAlign: "center",
    marginTop: 20,
  },
  notificationItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#34495e",
  },
  notificationBody: {
    fontSize: 16,
    color: "#2c3e50",
    marginTop: 5,
  },
  notificationTimestamp: {
    fontSize: 14,
    color: "#95a5a6",
    marginTop: 10,
  },
  clearButtonContainer: {
    backgroundColor: "#4B0082", // Matching the title color
    borderRadius: 20, // Making it circular
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    marginBottom: 5,
  },
  clearButtonText: {
    fontSize: 16,
    color: "#fff",
  },
});

export default NotificationHistory;
