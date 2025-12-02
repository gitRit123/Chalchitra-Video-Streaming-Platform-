import React from "react";
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Avatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function VideoCard({ video }) {
  const navigate = useNavigate();
  const thumb =
    video.thumbnailUrl
      ? (video.thumbnailUrl.startsWith("http")
        ? video.thumbnailUrl
        : `${process.env.REACT_APP_API_URL}${video.thumbnailUrl}`)
      : "/default-thumbnail.svg";

  return (
    <Card
      elevation={1}
      sx={{
        borderRadius: 2,
        maxWidth: 360,
        cursor: "pointer",
      }}
      onClick={() => navigate(`/video/${video._id}`)}
    >
      <CardActionArea>
        {/* Thumbnail */}
        <Box sx={{ width: "100%", position: "relative", aspectRatio: "16 / 9", borderRadius: 2, overflow: "hidden", bgcolor: "common.black" }}>
          <CardMedia
            component="img"
            image={thumb}
            alt={video.title}
            sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Box>

        {/* Video info */}
        <CardContent sx={{ display: "flex", gap: 2, pt: 1 }}>
          {/* Channel avatar */}
          <Avatar
            src={video.channelAvatar || ""}
            alt={video.channelName || "Channel"}
            sx={{ width: 40, height: 40 }}
          />

          {/* Text info */}
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" noWrap>
              {video.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {video.channelName || "Unknown Channel"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {video.views || 0} views •{" "}
              {new Date(video.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}