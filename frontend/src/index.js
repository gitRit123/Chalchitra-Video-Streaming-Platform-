import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { getTheme } from "./theme";

function ThemeRoot() {
  const [mode, setMode] = React.useState(localStorage.getItem("themeMode") || "dark");
  const theme = React.useMemo(() => getTheme(mode), [mode]);
  const toggleTheme = () => {
    const next = mode === "dark" ? "light" : "dark";
    setMode(next);
    localStorage.setItem("themeMode", next);
  };
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App themeMode={mode} onToggleTheme={toggleTheme} />
    </ThemeProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<ThemeRoot />);