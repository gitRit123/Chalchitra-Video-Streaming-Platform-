import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import axios from "axios";

export default function CommentForm({ videoId }) {
  const [text, setText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/comments/${videoId}`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setText("");
      window.location.reload(); // refresh comments
    } catch (err) {
      console.error("Comment error:", err.message);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", gap: 2, my: 2 }}>
      <TextField
        fullWidth
        label="Add a comment"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Button type="submit" variant="contained">Post</Button>
    </Box>
  );
}