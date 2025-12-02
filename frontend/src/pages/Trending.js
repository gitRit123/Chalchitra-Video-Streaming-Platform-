import React, { useEffect, useState } from "react";
import axios from "axios";
import { Grid, Skeleton, Typography } from "@mui/material";
import VideoCard from "../components/VideoCard";

export default function Trending() {
  const [videos, setVideos] = useState(null);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/videos/trending`)
      .then((res) => setVideos(res.data))
      .catch(() => setVideos([]));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Trending</Typography>
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





