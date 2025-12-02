import React, { useState } from "react";
import { TextField, Button, Paper, Typography, Snackbar, Alert } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [toast, setToast] = useState({ open: false, msg: "", severity: "success" });
  const navigate = useNavigate();

  const showToast = (msg, severity = "success") =>
    setToast({ open: true, msg, severity });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
        name,
        email,
        password,
        adminCode: adminCode || undefined,
      });
      showToast("Registration successful!");
      navigate("/login");
    } catch (err) {
      showToast(err.response?.data?.error || "Registration failed", "error");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
      <Paper sx={{ p: 4, width: 400 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Register</Typography>
        <form onSubmit={handleRegister} style={{ display: "grid", gap: 16 }}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
          <TextField
            label="Admin Invite Code (optional)"
            value={adminCode}
            onChange={(e) => setAdminCode(e.target.value)}
            helperText="Ask the site owner for the code to register as admin"
          />
          <Button type="submit" variant="contained">Register</Button>
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