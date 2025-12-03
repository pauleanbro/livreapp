import "react-native-reanimated";

import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { setBackgroundColorAsync } from "expo-system-ui";
import { ThemeProvider } from "styled-components/native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { theme } from "@/styles/theme";

void SplashScreen.preventAutoHideAsync();
void setBackgroundColorAsync("#000");

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider theme={theme}>
        <Slot />
        <StatusBar style="auto" />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
