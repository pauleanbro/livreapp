export const theme = {
  colors: {
    background: "#000",
    surface: "#0f0f0f",
    primary: "#7c3aed",
    secondary: "#22d3ee",
    text: "#f5f5f5",
    muted: "#9ca3af",
    border: "#1f2937",
  },
  spacing: (factor: number) => factor * 8,
  radius: {
    sm: 8,
    md: 12,
    lg: 20,
  },
  typography: {
    title: "KallistoBold",
    body: "SpaceMono",
  },
};

export type AppTheme = typeof theme;
