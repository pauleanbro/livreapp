import { Redirect } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React from "react";

import AnimatedSplashScreen from "@/components/AnimatedSplashScreen";

void SplashScreen.preventAutoHideAsync();

export default function PreLoadApp() {
  return (
    <AnimatedSplashScreen>
      <Redirect href="/auth" />
    </AnimatedSplashScreen>
  );
}
