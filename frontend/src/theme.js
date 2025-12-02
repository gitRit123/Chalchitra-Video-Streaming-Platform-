import { createTheme } from "@mui/material/styles";

export function getTheme(mode) {
  const isDark = mode === "dark";
  return createTheme({
    palette: {
      mode,
      primary: { main: "#ff0000" },
      secondary: { main: isDark ? "#ffffff" : "#111111" },
      background: {
        default: isDark ? "#181818" : "#ffffff",
        paper: isDark ? "#202020" : "#f7f7f7",
      },
      text: {
        primary: isDark ? "#ffffff" : "#111111",
        secondary: isDark ? "#aaaaaa" : "#555555",
      },
    },
    typography: {
      fontFamily: "Roboto, Arial, sans-serif",
      h5: { fontWeight: 600 },
      subtitle1: { fontSize: 14, fontWeight: 500 },
      body2: { fontSize: 13 },
    },
    components: {
      MuiButton: {
        styleOverrides: { root: { borderRadius: 20, textTransform: "none" } },
      },
      MuiPaper: {
        styleOverrides: { root: { borderRadius: 10 } },
      },
    },
  });
}

export default getTheme("dark");