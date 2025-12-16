export const theme = {
  colors: {
    background: "#093233",
    surface: "#FFFFFF",
    primary: "#44EAA2",
    secondary: "#027E68",
    text: "#064D4C",
    muted: "#3B7476",
    border: "#C7E4DD",
  },
  spacing: (factor: number) => factor * 8,
  radius: {
    sm: 8,
    md: 12,
    lg: 20,
  },
  typography: {
    // Map to loaded font families (via @expo-google-fonts)
    heading: "Inter_700Bold",
    headingRegular: "Inter_400Regular",
    body: "DMSans_400Regular",
    bodyBold: "DMSans_700Bold",
  },
};

export type AppTheme = typeof theme;
