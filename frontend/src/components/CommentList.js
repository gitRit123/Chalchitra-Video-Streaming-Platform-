import React, { useEffect, useState } from "react";
import axios from "axios";
import { List, ListItem, ListItemAvatar, Avatar, ListItemText } from "@mui/material";

export default function CommentList({ videoId }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/comments/${videoId}`)
      .then((res) => setComments(res.data))
      .catch(() => setComments([]));
  }, [videoId]);

  return (
    <List>
      {comments.map((c) => (
        <ListItem key={c._id} alignItems="flex-start">
          <ListItemAvatar>
            <Avatar src={c.userId?.avatarUrl || ""}>
              {c.userId?.name?.[0] || "U"}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={c.userId?.name || "Unknown"}
            secondary={c.text}
          />
        </ListItem>
      ))}
    </List>
  );
}