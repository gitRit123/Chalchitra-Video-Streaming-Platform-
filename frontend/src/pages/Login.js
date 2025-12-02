import React, { useState } from "react";
import { TextField, Button, Paper, Typography, Snackbar, Alert } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState({ open: false, msg: "", severity: "success" });
  const navigate = useNavigate();

  const showToast = (msg, severity = "success") =>
    setToast({ open: true, msg, severity });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("justLoggedIn", "1");
      showToast("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      showToast(err.response?.data?.error || "Login failed", "error");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
      <Paper sx={{ p: 4, width: 400 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Login</Typography>
        <form onSubmit={handleLogin} style={{ display: "grid", gap: 16 }}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="contained">Login</Button>
        </form>
      </Paper>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
      >
        <Alert severity={toast.severity}>{toast.msg}</Alert>
      </Snackbar>
    </div>
  );
}