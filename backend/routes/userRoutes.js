import express from "express";
import auth from "../middleware/auth.js";
import User from "../models/User.js";
import Video from "../models/Video.js";

const router = express.Router();

// Toggle subscribe to a channel
router.post("/:channelId/subscribe", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const channelId = req.params.channelId;
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user._id.equals(channelId)) return res.status(400).json({ error: "Cannot subscribe to yourself" });

    const idx = user.subscriptions.findIndex(id => id.toString() === channelId);
    let subscribed;
    if (idx === -1) {
      user.subscriptions.push(channelId);
      subscribed = true;
    } else {
      user.subscriptions.splice(idx, 1);
      subscribed = false;
    }
    await user.save();
    res.json({ subscribed });
  } catch {
    res.status(500).json({ error: "Error toggling subscription" });
  }
});

// Subscription feed
router.get("/feed", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    const videos = await Video.find({ userId: { $in: user.subscriptions } })
      .sort({ createdAt: -1 })
      .populate("userId", "name avatarUrl")
      .lean();
    const mapped = videos.map(v => ({
      ...v,
      channelName: v.userId?.name || "Unknown",
      channelAvatar: v.userId?.avatarUrl || "",
    }));
    res.json(mapped);
  } catch {
    res.status(500).json({ error: "Error fetching feed" });
  }
});

export default router;





