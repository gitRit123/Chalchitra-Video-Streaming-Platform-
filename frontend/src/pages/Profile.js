import React, { useEffect, useState } from "react";
import { Avatar, Box, Paper, Typography, Divider, Button, TextField, Snackbar, Alert } from "@mui/material";
import axios from "axios";

export default function Profile() {
  const [me, setMe] = useState(null);
  const [name, setName] = useState("");
  const [preview, setPreview] = useState(null);
  const [toast, setToast] = useState({ open: false, msg: "", severity: "success" });
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => { setMe(res.data); setName(res.data?.name || ""); })
      .catch(() => setMe(null));
  }, []);

  if (!me) return <Typography sx={{ p: 2 }}>Login to view your profile.</Typography>;

  return (
    <Box sx={{ p: 2 }}>
      <Paper sx={{ p: 3, display: "flex", gap: 2, alignItems: "center" }}>
        <Avatar src={preview || me.avatarUrl || ""} sx={{ width: 80, height: 80 }} />
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography variant="h6">{me.name}</Typography>
          <Typography variant="body2" color="text.secondary">{me.email}</Typography>
          <Typography variant="caption" color="text.secondary">Role: {me.role}</Typography>
          <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
            <input id="avatar-input" type="file" accept="image/*" hidden onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const url = URL.createObjectURL(file);
              setPreview(url);
            }} />
            <Button variant="outlined" onClick={() => document.getElementById("avatar-input").click()}>Add profile picture</Button>
            <Button
              variant="contained"
              onClick={async () => {
                const input = document.getElementById("avatar-input");
                const file = input.files?.[0];
                if (!file) { setToast({ open: true, msg: "Select an image first", severity: "warning" }); return; }
                try {
                  const token = localStorage.getItem("token");
                  const fd = new FormData();
                  fd.append("avatar", file);
                  const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/profile/me/avatar`, fd, {
                    headers: { Authorization: `Bearer ${token}` },
                  });
                  setMe({ ...me, avatarUrl: res.data.avatarUrl });
                  setPreview(null);
                  setToast({ open: true, msg: "Profile picture updated", severity: "success" });
                } catch (e) {
                  setToast({ open: true, msg: e.response?.data?.error || "Upload failed", severity: "error" });
                }
              }}
            >
              Upload
            </Button>
          </Box>
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mt: 2, display: "grid", gap: 2, maxWidth: 480 }}>
        <Typography variant="subtitle1">Profile</Typography>
        <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Button
          variant="contained"
          onClick={async () => {
            try {
              const token = localStorage.getItem("token");
              const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/profile/me`, { name }, {
                headers: { Authorization: `Bearer ${token}` },
              });
              setMe(res.data);
              setToast({ open: true, msg: "Profile updated", severity: "success" });
            } catch (e) {
              setToast({ open: true, msg: e.response?.data?.error || "Update failed", severity: "error" });
            }
          }}
        >
          Save
        </Button>
      </Paper>

      <Snackbar open={toast.open} autoHideDuration={2500} onClose={() => setToast({ ...toast, open: false })}>
        <Alert severity={toast.severity}>{toast.msg}</Alert>
      </Snackbar>
    </Box>
  );
}
