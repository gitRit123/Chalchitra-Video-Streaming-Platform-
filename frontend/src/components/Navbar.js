import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Box, IconButton, InputBase, Button, Snackbar, Alert, Switch } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";

export default function Navbar({ onMenu, themeMode, onToggleTheme }) {
  const navigate = useNavigate();
  const [query, setQuery] = React.useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [toast, setToast] = useState({ open: false, msg: "", severity: "success" });

  useEffect(() => {
    if (localStorage.getItem("justLoggedIn")) {
      setToast({ open: true, msg: "You are logged in", severity: "success" });
      localStorage.removeItem("justLoggedIn");
      setIsLoggedIn(true);
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${query}`);
  };

  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Toolbar sx={{ display: "flex", gap: 2 }}>
        <IconButton onClick={onMenu}>
          <MenuIcon />
        </IconButton>
        {/* Logo */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }} onClick={() => navigate("/")}>
          <img src="/logo.svg" alt="Chalchitra" width={28} height={28} />
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>chalchitra</Typography>
        </Box>

        {/* Search bar */}
        <Box
          component="form"
          onSubmit={handleSearch}
          sx={{
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            backgroundColor: "action.hover",
            borderRadius: 999,
            px: 1,
          }}
        >
          <InputBase
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ flexGrow: 1, px: 1 }}
          />
          <IconButton type="submit">
            <SearchIcon />
          </IconButton>
        </Box>

        {/* Theme toggle */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="caption">{themeMode === "dark" ? "Dark" : "Light"}</Typography>
          <Switch checked={themeMode === "dark"} onChange={onToggleTheme} />
        </Box>

        {/* Upload + Auth */}
        <Button variant="contained" color="error" onClick={() => navigate("/dashboard")}>Upload</Button>
        {isLoggedIn ? (
          <>
            <Button onClick={() => navigate("/profile")}>Profile</Button>
            <Button
              onClick={() => {
                localStorage.removeItem("token");
                setIsLoggedIn(false);
                setToast({ open: true, msg: "Logged out", severity: "info" });
                navigate("/");
              }}
            >
              Logout
            </Button>
          </>
        ) : (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Button onClick={() => navigate("/login")}>Login</Button>
            <Button onClick={() => navigate("/register")}>Sign up</Button>
            <Button onClick={() => navigate("/admin-login")}>Admin</Button>
          </Box>
        )}
      </Toolbar>
      <Snackbar open={toast.open} autoHideDuration={2500} onClose={() => setToast({ ...toast, open: false })}>
        <Alert severity={toast.severity} sx={{ width: "100%" }}>{toast.msg}</Alert>
      </Snackbar>
    </AppBar>
  );
}