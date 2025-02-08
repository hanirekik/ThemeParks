import React, { useEffect } from "react";
import BottomTabNavigator from "./pages/BottomNavigatorPage";
import { requestNotificationPermissions } from "./services/NotificationService";

export default function Index() {
  useEffect(() => {
    requestNotificationPermissions();
  }, []);

  return <BottomTabNavigator />;
}
