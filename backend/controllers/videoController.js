import Video from "../models/Video.js";
import fs from "fs";
import path from "path";

// Create video metadata
export const createVideo = async (req, res) => {
  try {
    const { title, description, videoUrl, thumbnailUrl } = req.body;
    if (!title || !description || !videoUrl) {
      return res.status(400).json({ error: "Title, description, and videoUrl are required" });
    }
    const video = await Video.create({
      title, description, videoUrl, thumbnailUrl, userId: req.user.id
    });
    res.status(201).json(video);
  } catch (err) {
    res.status(500).json({ error: "Server error while creating video" });
  }
};

// List videos
export const listVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 }).populate("userId", "name avatarUrl").lean();
    const mapped = videos.map(v => ({
      ...v,
      channelName: v.userId?.name || "Unknown",
      channelAvatar: v.userId?.avatarUrl || "",
      channelId: v.userId?._id || v.userId,
    }));
    res.json(mapped);
  } catch {
    res.status(500).json({ error: "Server error while fetching videos" });
  }
};

// Get single video
export const getVideo = async (req, res) => {
  try {
    const videoDoc = await Video.findById(req.params.id).populate("userId", "name avatarUrl").lean();
    if (!videoDoc) return res.status(404).json({ error: "Video not found" });
    const video = {
      ...videoDoc,
      channelName: videoDoc.userId?.name || "Unknown",
      channelAvatar: videoDoc.userId?.avatarUrl || "",
      channelId: videoDoc.userId?._id || videoDoc.userId,
    };
    res.json(video);
  } catch {
    res.status(500).json({ error: "Server error while fetching video" });
  }
};

// Increment views
export const incrementViews = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: "Video not found" });
    video.views += 1;
    await video.save();
    res.json({ views: video.views });
  } catch {
    res.status(500).json({ error: "Error updating views" });
  }
};

// Like/Dislike
export const toggleLike = async (req, res) => {
  try {
    const { type } = req.body; // 'like' | 'dislike'
    const userId = req.user.id;
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: "Video not found" });

    const likedIdx = video.likedBy.findIndex((id) => id.toString() === userId);
    const dislikedIdx = video.dislikedBy.findIndex((id) => id.toString() === userId);

    if (type === "like") {
      if (likedIdx !== -1) {
        // toggle off like
        video.likedBy.splice(likedIdx, 1);
      } else {
        // add like and remove dislike if present
        video.likedBy.push(userId);
        if (dislikedIdx !== -1) video.dislikedBy.splice(dislikedIdx, 1);
      }
    } else if (type === "dislike") {
      if (dislikedIdx !== -1) {
        // toggle off dislike
        video.dislikedBy.splice(dislikedIdx, 1);
      } else {
        // add dislike and remove like if present
        video.dislikedBy.push(userId);
        if (likedIdx !== -1) video.likedBy.splice(likedIdx, 1);
      }
    } else {
      return res.status(400).json({ error: "Invalid type" });
    }

    // maintain counts for backward compatibility
    video.likes = video.likedBy.length;
    video.dislikes = video.dislikedBy.length;

    await video.save();

    const myReaction = video.likedBy.some((id) => id.toString() === userId)
      ? "like"
      : video.dislikedBy.some((id) => id.toString() === userId)
      ? "dislike"
      : null;

    res.json({ likes: video.likes, dislikes: video.dislikes, myReaction });
  } catch (e) {
    res.status(500).json({ error: "Error updating likes/dislikes" });
  }
};

// Search videos
export const searchVideos = async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    if (!q) return res.json([]);
    const regex = new RegExp(q, "i");
    const videos = await Video.find({
      $or: [{ title: regex }, { description: regex }],
    }).sort({ createdAt: -1 }).populate("userId", "name avatarUrl").lean();
    const mapped = videos.map(v => ({
      ...v,
      channelName: v.userId?.name || "Unknown",
      channelAvatar: v.userId?.avatarUrl || "",
      channelId: v.userId?._id || v.userId,
    }));
    res.json(mapped);
  } catch {
    res.status(500).json({ error: "Server error while searching videos" });
  }
};

// Trending videos
export const trendingVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ views: -1, createdAt: -1 }).limit(50).populate("userId", "name avatarUrl").lean();
    const mapped = videos.map(v => ({
      ...v,
      channelName: v.userId?.name || "Unknown",
      channelAvatar: v.userId?.avatarUrl || "",
      channelId: v.userId?._id || v.userId,
    }));
    res.json(mapped);
  } catch {
    res.status(500).json({ error: "Server error while fetching trending videos" });
  }
};

// Delete video (admin only)
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: "Video not found" });

    // authorize: admin or owner
    const isOwner = video.userId?.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: "Not authorized to delete this video" });
    }

    // Best-effort local file cleanup if path is inside /uploads
    if (video.videoUrl && video.videoUrl.startsWith("/uploads/")) {
      const filePath = path.join(process.cwd(), "backend", video.videoUrl);
      fs.unlink(filePath, () => {});
    }

    await Video.findByIdAndDelete(req.params.id);
    res.json({ message: "Video deleted" });
  } catch {
    res.status(500).json({ error: "Error deleting video" });
  }
};