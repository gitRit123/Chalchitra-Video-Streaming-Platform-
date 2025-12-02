import React, { useEffect, useState } from "react";
import axios from "axios";
import { Grid, Skeleton, Typography } from "@mui/material";
import VideoCard from "../components/VideoCard";

export default function Subscriptions() {
  const [videos, setVideos] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get(`${process.env.REACT_APP_API_URL}/api/users/feed`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => setVideos(res.data))
      .catch(() => setVideos([]));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Subscriptions</Typography>
      {!videos ? (
        <Grid container spacing={2}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Skeleton variant="rectangular" height={180} />
              <Skeleton />
              <Skeleton width="60%" />
            </Grid>
          ))}
        </Grid>
      ) : videos.length === 0 ? (
        <Typography>You are not subscribed to any channels yet.</Typography>
      ) : (
        <Grid container spacing={2}>
          {videos.map((video) => (
            <Grid item xs={12} sm={6} md={3} key={video._id}>
              <VideoCard video={video} />
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
}





