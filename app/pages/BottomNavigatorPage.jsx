import * as React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import HomePage from "./HomePage";
import Settings from "./SettingsPage";
import NotificationHistory from "./NotificationHistoryPage";

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#4B0082",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      {[
        {
          name: "Home",
          component: HomePage,
          icon: "home",
          label: "Home",
        },
        {
          name: "Map",
          component: HomePage,
          icon: "map-marker",
          label: "Map",
        },
        {
          name: "NotificationHistory",
          component: NotificationHistory,
          icon: "bell",
          label: "Notifications",
        },
        {
          name: "Settings",
          component: Settings,
          icon: "cog",
          label: "Settings",
        },
      ].map(({ name, component, icon, label }) => (
        <Tab.Screen
          key={name}
          name={name}
          component={component}
          options={{
            tabBarLabel: label,
            tabBarIcon: ({ focused, color, size }) => (
              <View
                style={[
                  styles.iconContainer,
                  focused && styles.iconContainerActive,
                ]}
              >
                <Icon name={icon} size={24} color={color} />
              </View>
            ),
            tabBarButton: (props) => (
              <TouchableOpacity
                {...props}
                style={styles.tabBarButton}
                activeOpacity={0.7}
                onLongPress={() => alert(`Long press on ${label}`)}
              />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#fff",
    elevation: 8,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: -3 },
    height: 80,
    paddingBottom: 10,
  },
  tabBarLabel: {
    fontSize: 12,
    marginTop: 5,
    marginBottom: 5,
  },
  tabBarButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: 30,
    borderRadius: 25,
    backgroundColor: "transparent",
  },
  iconContainerActive: {
    backgroundColor: "#F3E5F5",
  },
});
