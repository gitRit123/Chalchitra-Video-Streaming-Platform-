import Comment from "../models/Comment.js";

// Add comment
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Comment text is required" });

    const comment = await Comment.create({
      videoId: req.params.videoId,
      userId: req.user.id,
      text,
    });

    res.status(201).json(comment);
  } catch {
    res.status(500).json({ error: "Error adding comment" });
  }
};

// List comments
export const listComments = async (req, res) => {
  try {
    const comments = await Comment.find({ videoId: req.params.videoId })
      .populate("userId", "name avatarUrl")
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch {
    res.status(500).json({ error: "Error fetching comments" });
  }
};