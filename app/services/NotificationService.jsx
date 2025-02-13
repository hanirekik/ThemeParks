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

export const scheduleNotification = async (
  attractionName,
  isFastPass = false,
  timeToStartWalking = null,
  cannotMakeIt = false
) => {
  if (!isFastPass) {
    // Notifications are only for Fast Pass users
    console.log("Notifications are only available for Fast Pass users.");
    return;
  }

  let content, trigger;

  if (cannotMakeIt) {
    content = {
      title: "Fast Pass Alert",
      body: `You can't make it on time for your Fast Pass at ${attractionName}.`,
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    };
    trigger = null;
  } else if (timeToStartWalking === 0) {
    content = {
      title: "Fast Pass Reminder",
      body: `You should start heading to ${attractionName} now!`,
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    };
    trigger = null;
  } else {
    content = {
      title: "Fast Pass Reminder",
      body: `Start heading to ${attractionName} in ${Math.round(
        timeToStartWalking / 60
      )} minutes!`,
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    };
    trigger = {
      seconds: timeToStartWalking,
    };
  }

  await Notifications.scheduleNotificationAsync({
    content,
    trigger,
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
