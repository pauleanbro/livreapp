import "react-native-reanimated";

import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { setBackgroundColorAsync } from "expo-system-ui";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "styled-components/native";
import React from "react";
import { useFonts, Inter_400Regular, Inter_700Bold } from "@expo-google-fonts/inter";
import { DMSans_400Regular, DMSans_700Bold } from "@expo-google-fonts/dm-sans";

import { theme } from "@/styles/theme";

void SplashScreen.preventAutoHideAsync();
void setBackgroundColorAsync(theme.colors.background);

export default function RootLayout() {
  const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_700Bold, DMSans_400Regular, DMSans_700Bold });

  React.useEffect(() => {
    if (fontsLoaded) void SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <ThemeProvider theme={theme}>
        <Slot />
        <StatusBar style="light" backgroundColor={theme.colors.background} />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
