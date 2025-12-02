import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import VideoWatch from "./pages/VideoWatch";
import Dashboard from "./pages/Dashboard";
import SearchPage from "./pages/SearchPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Trending from "./pages/Trending";
import Subscriptions from "./pages/Subscriptions";
import AdminLogin from "./pages/AdminLogin";
import Profile from "./pages/Profile";

// Protected route wrapper
function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

export default function App({ themeMode, onToggleTheme }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  return (
    <Router>
      <Navbar onMenu={() => setSidebarOpen(true)} themeMode={themeMode} onToggleTheme={onToggleTheme} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trending" element={<Trending />} />
        <Route
          path="/subscriptions"
          element={
            <PrivateRoute>
              <Subscriptions />
            </PrivateRoute>
          }
        />
        <Route path="/video/:id" element={<VideoWatch />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="/search" element={<SearchPage />} />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}