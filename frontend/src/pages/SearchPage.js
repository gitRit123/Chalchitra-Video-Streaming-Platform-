import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Grid, Typography, Skeleton } from "@mui/material";
import VideoCard from "../components/VideoCard";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function SearchPage() {
  const query = useQuery().get("q");
  const [videos, setVideos] = useState(null);

  useEffect(() => {
    if (query) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/videos/search?q=${query}`)
        .then((res) => setVideos(res.data))
        .catch(() => setVideos([]));
    }
  }, [query]);

  return (
      <div style={{ padding: 20 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Search results for "{query}"
      </Typography>
      {!videos ? (
        <Grid container spacing={2}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={i}>
                <div style={{ width: "100%", aspectRatio: "16 / 9", background: "#2a2a2a", borderRadius: 8 }} />
                <Skeleton />
                <Skeleton width="60%" />
              </Grid>
            ))}
        </Grid>
      ) : videos.length === 0 ? (
        <Typography>No videos found.</Typography>
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
  );
}