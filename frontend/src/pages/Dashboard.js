import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Snackbar,
  Alert,
  LinearProgress,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

export default function Dashboard() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [thumbFile, setThumbFile] = useState(null);
  const [thumbUrl, setThumbUrl] = useState("");
  const [videos, setVideos] = useState([]);
  const [toast, setToast] = useState({ open: false, msg: "", severity: "success" });
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [me, setMe] = useState(null);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/videos`).then((res) => setVideos(res.data)).catch(() => setVideos([]));
    const token = localStorage.getItem("token");
    if (token) {
      axios.get(`${process.env.REACT_APP_API_URL}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => setMe(res.data))
        .catch(() => setMe(null));
    }
  }, []);

  const showToast = (msg, severity = "success") =>
    setToast({ open: true, msg, severity });

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return showToast("Please select a video file", "warning");

    try {
      const token = localStorage.getItem("token");
      setLoading(true);

      // Step 1: Upload file
      const formData = new FormData();
      formData.append("video", file);

      const uploadRes = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/upload/video`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          onUploadProgress: (e) =>
            setProgress(Math.round((e.loaded * 100) / e.total)),
        }
      );

      const videoUrl = uploadRes.data.url;

      // Step 1b: Upload thumbnail file if provided
      let finalThumbUrl = thumbUrl;
      if (thumbFile) {
        const tf = new FormData();
        tf.append("thumbnail", thumbFile);
        const tRes = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/upload/thumbnail`,
          tf,
          { headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` } }
        );
        finalThumbUrl = tRes.data.url;
      } else if (!finalThumbUrl && uploadRes.data.thumbnailUrl) {
        finalThumbUrl = uploadRes.data.thumbnailUrl;
      }

      // Step 2: Save metadata
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/videos`,
        { title, description, videoUrl, thumbnailUrl: finalThumbUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showToast("Video uploaded successfully!");
      setTitle(""); setDescription(""); setFile(null); setThumbFile(null); setThumbUrl("");
      setProgress(0); setLoading(false);

      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/videos`);
      setVideos(res.data);
    } catch (err) {
      setLoading(false);
      showToast(err.response?.data?.error || "Upload failed", "error");
    }
  };

  const handleDelete = async (videoId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/videos/${videoId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast("Video deleted");
      setVideos((prev) => prev.filter((v) => v._id !== videoId));
    } catch (err) {
      showToast(err.response?.data?.error || "Delete failed", "error");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Upload a Video</Typography>
        <form onSubmit={handleUpload} style={{ display: "grid", gap: 16 }}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            multiline
          />
          <TextField
            label="Thumbnail URL (optional)"
            value={thumbUrl}
            onChange={(e) => setThumbUrl(e.target.value)}
            placeholder="https://..."
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setThumbFile(e.target.files[0])}
          />
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          {loading && <LinearProgress variant="determinate" value={progress} />}
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Uploading..." : "Upload"}
          </Button>
        </form>
      </Paper>

      <Typography variant="h6" sx={{ mb: 2 }}>My Videos</Typography>
      <Grid container spacing={2}>
        {videos.map((v) => (
          <Grid item xs={12} sm={6} md={4} key={v._id}>
            <Card>
              <CardMedia
                component="video"
                controls
                src={`${process.env.REACT_APP_API_URL}${v.videoUrl}`}
                sx={{ backgroundColor: "black", width: "100%", aspectRatio: "16 / 9" }}
              />
              <CardContent>
                <Typography variant="subtitle1" noWrap>{v.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {v.description}
                </Typography>
              </CardContent>
              {(me?.role === "admin" || v.channelId === me?._id || v.userId?._id === me?._id) && (
                <CardActions sx={{ justifyContent: "flex-end" }}>
                  <Button
                    color="error"
                    startIcon={<DeleteOutlineIcon />}
                    onClick={() => handleDelete(v._id)}
                  >
                    Delete
                  </Button>
                </CardActions>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
      >
        <Alert severity={toast.severity} sx={{ width: "100%" }}>
          {toast.msg}
        </Alert>
      </Snackbar>
    </div>
  );
}