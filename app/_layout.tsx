import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { router, Slot } from "expo-router";

import { ThemedView } from "@/components/ThemedView";
import { SessionProvider, useSession } from "@/contexts/AuthContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { session, isLoading } = useSession();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    async function prepare() {
      if (loaded && !isLoading) {
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, [isLoading, loaded]);

  useEffect(() => {
    if (!isLoading && !session) {
      router.navigate("/");
    }
  }, [isLoading, session]);

  if (!loaded && isLoading) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <StatusBar style="auto" />
      <SessionProvider>
        <ThemedView style={{ flex: 1 }}>
          <Slot />
        </ThemedView>
      </SessionProvider>
      {/* <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
        </Stack> */}
    </ThemeProvider>
  );
}
