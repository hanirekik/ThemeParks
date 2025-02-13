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
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as Location from "expo-location";
import { scheduleNotification } from "../services/NotificationService";
import { GOOGLE_MAPS_API_KEY } from "../../config";
import imageMap from "../utils/imageMap"; // Import the generated mapping
import moment from "moment";

const AttractionListAll = ({ item }) => {
  const router = useRouter();
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
  const [globalNotificationsEnabled, setGlobalNotificationsEnabled] =
    useState(false);
  const [fastPassTime, setFastPassTime] = useState(null);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [coordinates, setCoordinates] = useState({
    latitude: null,
    longitude: null,
  });

  const imageSource = imageMap[item.name] || imageMap["default"]; // Default image if not found

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

      const savedFastPass = await AsyncStorage.getItem(`fastpass_${item.id}`);
      if (savedFastPass) setFastPassTime(savedFastPass);
    };

    const getUserLocation = async () => {
      console.log("Requesting location permissions..."); // Debugging log
      let { status } = await Location.requestForegroundPermissionsAsync();

      console.log("Location permission status:", status); // Debugging log

      if (status !== "granted") {
        if (!global.alertShown) {
          global.alertShown = true; // Prevent multiple alerts
          Alert.alert("Permission Denied", "Location permission is required.", [
            {
              text: "OK",
              onPress: () => {
                global.alertShown = false; // Reset so it can be shown again if needed later
              },
            },
          ]);
        }
        return;
      }

      try {
        console.log("Fetching user location..."); // Debugging log
        const location = await Location.getCurrentPositionAsync({});
        console.log("User location fetched:", location.coords); // Debugging log
        setUserLocation(location.coords);
      } catch (error) {
        console.error("Error fetching user location:", error);
      }
    };

    loadPreferences();
    getUserLocation(); // Fetch user location when the component mounts
  }, [item.id]);

  // Function to fetch coordinates by name
  const fetchCoordinatesByName = async (attractionName) => {
    try {
      const response = await fetch(
        `https://api.themeparks.wiki/v1/entity/${item.id}`
      );
      const data = await response.json();

      console.log(
        "API Response for Coordinates:",
        JSON.stringify(data, null, 2)
      ); // Debugging log

      // Check if the response contains coordinates directly
      if (data.location && data.location.latitude && data.location.longitude) {
        console.log("Coordinates found directly in response:", data.location); // Debugging log
        return {
          latitude: data.location.latitude,
          longitude: data.location.longitude,
        };
      } else {
        console.log("Coordinates are null for this attraction."); // Debugging log
        return null;
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      return null;
    }
  };

  // Function to calculate walking time using Google Maps API
  const calculateTravelTime = async () => {
    if (!userLocation) {
      console.log("User location is not available.");
      return;
    }

    if (!coordinates.latitude || !coordinates.longitude) {
      console.log("Attraction coordinates are not available.");
      return;
    }

    const origin = `${userLocation.latitude},${userLocation.longitude}`;
    const destination = `${coordinates.latitude},${coordinates.longitude}`;
    const apiUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&mode=walking&key=${GOOGLE_MAPS_API_KEY}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      console.log("Google Maps API Response:", JSON.stringify(data, null, 2)); // Debugging log

      if (
        data.rows &&
        data.rows[0] &&
        data.rows[0].elements[0].status === "OK"
      ) {
        const duration = data.rows[0].elements[0].duration.text;
        const durationInSeconds = data.rows[0].elements[0].duration.value;
        console.log(`Walking Time to ${item.name}: ${duration}`);
        return durationInSeconds;
      } else {
        console.error("Invalid API response structure or status not OK.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching travel time:", error);
      return null;
    }
  };

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
      // Fetch coordinates for the attraction
      const fetchedCoordinates = await fetchCoordinatesByName(item.name);

      if (fetchedCoordinates) {
        // Update coordinates state
        setCoordinates(fetchedCoordinates);

        // Wait for the state to update
        await new Promise((resolve) => setTimeout(resolve, 100)); // Small delay to ensure state update

        console.log("Updated coordinates state:", coordinates); // Debugging log

        // Coordinates found, proceed with enabling notifications
        Alert.alert("Fast Pass", "Do you have a Fast Pass?", [
          { text: "No", onPress: () => handleNoFastPass() },
          { text: "Yes", onPress: () => setDatePickerVisible(true) },
        ]);
      } else {
        // Coordinates not found, disable notifications
        setIsNotificationEnabled(false);
        await AsyncStorage.setItem(`notification_${item.id}`, "false");
        Alert.alert(
          "Coordinates Missing",
          "Unable to fetch coordinates for this attraction. Notifications cannot be enabled."
        );
      }
    } else {
      // Disable notifications
      setFastPassTime(null);
      await AsyncStorage.removeItem(`fastpass_${item.id}`);
    }
  };

  const handleNoFastPass = async () => {
    setIsNotificationEnabled(false); // Disable notification if no Fast Pass
    await AsyncStorage.setItem(`notification_${item.id}`, "false"); // Save the preference
    Alert.alert(
      "No Fast Pass",
      "Sorry, Notifications are only available for fastpass."
    );
  };

  const handleConfirmTime = async (date) => {
    const now = new Date();
    const selectedTime = new Date(date);

    // Check if the selected time is in the past
    if (selectedTime <= now) {
      Alert.alert(
        "Invalid Time",
        "You cannot select a time in the past. Please choose another time."
      );
      return;
    }

    const selectedHour = selectedTime.getHours();
    const selectedMinute = selectedTime.getMinutes();

    if (selectedHour < 9 || selectedHour > 23) {
      Alert.alert(
        "Invalid Time",
        "Fast Pass is only available between 09:00 - 20:59."
      );
      return;
    }

    const formattedTime = `${String(selectedHour).padStart(2, "0")}:${String(
      selectedMinute
    ).padStart(2, "0")}`;
    console.log("Selected Fast Pass Time:", formattedTime);
    setFastPassTime(formattedTime);
    await AsyncStorage.setItem(`fastpass_${item.id}`, formattedTime);
    setDatePickerVisible(false);

    // Ensure coordinates are available
    if (!coordinates.latitude || !coordinates.longitude) {
      console.log("Attraction coordinates are not available.");
      return;
    }

    console.log("Using coordinates:", coordinates); // Debugging log

    const travelTimeInSeconds = await calculateTravelTime();
    if (travelTimeInSeconds) {
      const fastPassDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        selectedHour,
        selectedMinute,
        0
      );

      const timeRemaining = (fastPassDate - now) / 1000; // Time remaining in seconds

      console.log("Walking Time (seconds):", travelTimeInSeconds);
      console.log("Time Remaining (seconds):", timeRemaining);

      if (travelTimeInSeconds > timeRemaining) {
        console.log("You can't make it on time.");
        Alert.alert("Warning", "You can't make it on time.");
        await scheduleNotification(
          item.name,
          true, // isFastPass
          null, // timeToStartWalking (not needed)
          true // cannotMakeIt
        );
      } else if (travelTimeInSeconds === timeRemaining) {
        console.log("Start heading now.");
        await scheduleNotification(
          item.name,
          true, // isFastPass
          0 // timeToStartWalking (start now)
        );
      } else {
        console.log("You can make it on time.");
        const timeToStartWalking = timeRemaining - travelTimeInSeconds;
        await scheduleNotification(
          item.name,
          true, // isFastPass
          timeToStartWalking // timeToStartWalking in seconds
        );
      }
    }
  };

  return (
    <View style={styles.item}>
      <Image source={imageSource} style={styles.image} />
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
        <Text style={styles.lastUpdated}>
          Last Updated: {moment(item.lastUpdated).format("YYYY-MM-DD HH:mm:ss")}
        </Text>
        {fastPassTime ? (
          <Text style={styles.fastPassText}>🎟️ Fast Pass: {fastPassTime}</Text>
        ) : (
          <Text style={styles.fastPassText}></Text>
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

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="time"
        onConfirm={handleConfirmTime}
        onCancel={() => setDatePickerVisible(false)}
        minuteInterval={1}
        is24Hour
        minimumDate={new Date()}
      />
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
  fastPassText: {
    fontSize: 16,
    color: "#3498db",
    marginTop: 5,
  },
  bellIcon: {
    marginLeft: 10,
  },
});

export default AttractionListAll;
