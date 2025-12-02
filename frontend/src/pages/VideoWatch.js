import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Paper,
  Typography,
  Divider,
  Button,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import CommentForm from "../components/CommentForm";
import CommentList from "../components/CommentList";

export default function VideoWatch() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [subscribing, setSubscribing] = useState(false);
  const [me, setMe] = useState(null);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/videos/${id}`)
      .then((res) => {
        setVideo(res.data);
        setLikes(res.data.likes || 0);
        setDislikes(res.data.dislikes || 0);

        // increment views
        axios.post(`${process.env.REACT_APP_API_URL}/api/videos/${id}/views`);
      })
      .catch(() => setVideo(null));

    // fetch current user if logged in
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setMe(res.data))
        .catch(() => setMe(null));
    } else {
      setMe(null);
    }
  }, [id]);

  const handleLike = async (type) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) { window.location.href = "/login"; return; }
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/videos/${id}/like`,
        { type },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLikes(res.data.likes);
      setDislikes(res.data.dislikes);
    } catch (err) {
      console.error("Like error:", err.message);
    }
  };

  const handleSubscribe = async () => {
    if (!video?.channelId) return;
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    try {
      setSubscribing(true);
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/${video.channelId}/subscribe`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (typeof res.data?.subscribed === "boolean") setSubscribed(res.data.subscribed);
    } catch (err) {
      console.error("Subscribe error:", err.message);
    } finally {
      setSubscribing(false);
    }
  };

  const canDelete = me && (me.role === "admin" || me._id === video?.channelId);
  if (!video) return <Typography sx={{ p: 2 }}>Loading...</Typography>;

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ maxWidth: 800, mx: "auto" }}>
        <Paper sx={{ p: 2, mb: 3 }}>
          {/* Video player */}
          <Box sx={{ width: "100%", position: "relative", borderRadius: 2, overflow: "hidden", bgcolor: "common.black" }}>
            {/* 16:9 responsive container */}
            <Box sx={{ width: "100%", aspectRatio: "16 / 9", position: "relative" }}>
              <video
                controls
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", backgroundColor: "black", display: "block" }}
                src={`${process.env.REACT_APP_API_URL}${video.videoUrl}`}
              />
            </Box>
          </Box>

          {/* Title + channel row */}
          <Typography variant="h5" sx={{ mt: 2 }}>{video.title}</Typography>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <img
                src={video.channelAvatar || ""}
                alt={video.channelName}
                width={40}
                height={40}
                style={{ borderRadius: "50%" }}
              />
              <Box>
                <Typography variant="subtitle1">{video.channelName}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {video.views || 0} views • {new Date(video.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {canDelete && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={async () => {
                    try {
                      const token = localStorage.getItem("token");
                      await axios.delete(`${process.env.REACT_APP_API_URL}/api/videos/${id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                      });
                      window.history.back();
                    } catch (err) {
                      console.error("Delete error:", err.response?.data || err.message);
                    }
                  }}
                >
                  Delete
                </Button>
              )}
              <Button variant={subscribed ? "outlined" : "contained"} color="error" onClick={handleSubscribe} disabled={subscribing}>
                {subscribing ? "Saving..." : subscribed ? "Subscribed" : "Subscribe"}
              </Button>
            </Box>
          </Box>

          {/* Actions row */}
          <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
            <IconButton onClick={() => handleLike("like")}>
              <ThumbUpIcon /> {likes}
            </IconButton>
            <IconButton onClick={() => handleLike("dislike")}>
              <ThumbDownIcon /> {dislikes}
            </IconButton>
            {/* Subscribe moved to channel row */}
          </Box>

          <Divider sx={{ my: 2 }} />
          <Typography variant="body1">{video.description}</Typography>
        </Paper>

        {/* Comments section */}
        <Divider sx={{ mb: 2 }} />
        <Typography variant="h6">Comments</Typography>
        <CommentForm videoId={id} />
        <CommentList videoId={id} />
      </Box>
    </Box>
  );
}