import React, { useEffect, useState } from "react";
import axios from "axios";
import { Grid, Skeleton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import VideoCard from "../components/VideoCard";

export default function Home() {
  const [videos, setVideos] = useState(null);
  const [showGate, setShowGate] = useState(!localStorage.getItem("guest") && !localStorage.getItem("token"));

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/videos`)
      .then((res) => setVideos(res.data))
      .catch(() => setVideos([]));
  }, []);

  return (
      <div style={{ padding: 20 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <Dialog open={showGate} onClose={() => {}}>
          <DialogTitle>Welcome to Chalchitra</DialogTitle>
          <DialogContent>
            <Typography variant="body2">Continue as guest to browse videos, or login to like, comment, and upload.</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { localStorage.setItem("guest", "1"); setShowGate(false); }}>Continue as guest</Button>
            <Button variant="contained" onClick={() => { window.location.href = "/login"; }}>Login</Button>
          </DialogActions>
        </Dialog>
        {!videos ? (
          <Grid container spacing={2}>
            {Array.from({ length: 8 }).map((_, i) => (
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={i}>
                <div style={{ width: "100%", aspectRatio: "16 / 9", background: "#2a2a2a", borderRadius: 8 }} />
                <Skeleton />
                <Skeleton width="60%" />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid container spacing={2}>
            {videos.map((video) => (
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={video._id}>
                <VideoCard video={video} />
              </Grid>
            ))}
          </Grid>
        )}
        </div>
      </div>
  );
}