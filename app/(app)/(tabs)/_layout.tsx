import { Tabs } from "expo-router";
import React, { useEffect } from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useGetAccount } from "@/hooks/useGetAccount";
import useNotificationMessage from "@/hooks/useNotificationMessage";
import * as Clipboard from "expo-clipboard";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import * as TaskManager from "expo-task-manager";
import { Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const BACKGROUND_NOTIFICATION_TASK = "BACKGROUND-NOTIFICATION-TASK";

TaskManager.defineTask(
  BACKGROUND_NOTIFICATION_TASK,
  ({ data, error, executionInfo }) => {
    console.log(data, error, executionInfo);
    console.log("Received a notification in the background!");
  }
);
Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);

export default function TabLayout() {
  useNotificationMessage();
  const colorScheme = useColorScheme();

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  const { data: address, isLoading } = useGetAccount("address");

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(address!);
  };

  return (
    <SafeAreaProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            headerTitleStyle: {
              fontSize: 18,
              fontWeight: "bold",
              color: Colors[colorScheme ?? "light"].text,
            },
            headerStyle: {
              borderBottomColor: "white",
              borderBottomWidth: 0.4,
            },
            headerTitleAlign: "center",
            headerLeftLabelVisible: true,
            headerShadowVisible: true,
            headerShown: true,
            headerTintColor: Colors[colorScheme ?? "light"].tint,
            headerTitle: (props) => {
              return (
                <ThemedText onPress={copyToClipboard}>
                  {isLoading ? "Loading..." : address!}
                </ThemedText>
              );
            },
            // header(props) {
            //   console.log(props);
            //   return props
            // },
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "home" : "home-outline"}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="account"
          options={{
            headerTitleStyle: {
              fontSize: 18,
              fontWeight: "bold",
              color: Colors[colorScheme ?? "light"].text,
            },
            headerStyle: {
              borderBottomColor: "white",
              borderBottomWidth: 0.4,
            },
            headerTitleAlign: "center",
            headerLeftLabelVisible: true,
            headerShadowVisible: true,
            headerTintColor: Colors[colorScheme ?? "light"].tint,
            headerShown: true,
            headerTitle: "Account",
            title: "Account",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "person" : "person-outline"}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </SafeAreaProvider>
  );
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
  } else {
    alert("Must use physical device for Push Notifications");
  }
}
