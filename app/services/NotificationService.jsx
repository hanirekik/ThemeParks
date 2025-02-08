import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const requestNotificationPermissions = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    alert("You need to enable notifications for this feature to work.");
  }
};

export const scheduleNotification = async (attractionName) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Wait Time Alert",
      body: `The wait time for ${attractionName} is less than 20 minutes!`,
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger: null,
  });
};

export const saveNotificationPreference = async (itemId, isEnabled) => {
  await AsyncStorage.setItem(`notification_${itemId}`, isEnabled.toString());
};

export const loadNotificationPreference = async (itemId) => {
  const savedPreference = await AsyncStorage.getItem(`notification_${itemId}`);
  return savedPreference === "true";
};

export const saveNotificationToHistory = async (notification) => {
  try {
    const history = await getNotificationHistory();
    const updatedHistory = [notification, ...history];
    await AsyncStorage.setItem(
      "notificationHistory",
      JSON.stringify(updatedHistory)
    );
  } catch (error) {
    console.error("Failed to save notification to history:", error);
  }
};

export const getNotificationHistory = async () => {
  try {
    const history = await AsyncStorage.getItem("notificationHistory");
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error("Failed to get notification history:", error);
    return [];
  }
};

export const clearNotificationHistory = async () => {
  try {
    await AsyncStorage.removeItem("notificationHistory");
  } catch (error) {
    console.error("Failed to clear notification history:", error);
  }
};
