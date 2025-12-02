import express from "express";
import multer from "multer";
import path from "path";
import auth from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

// Multer storage for avatars
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || ".png";
    const name = `avatar_${req.user.id}_${Date.now()}${ext}`;
    cb(null, name);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Invalid file type"));
  },
});

// Upload avatar
router.post("/me/avatar", auth, upload.single("avatar"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const avatarUrl = `/uploads/${req.file.filename}`;
    await User.findByIdAndUpdate(req.user.id, { avatarUrl });
    res.json({ avatarUrl });
  } catch (e) {
    res.status(500).json({ error: "Error uploading avatar" });
  }
});

// Update profile fields (name, avatarUrl via URL)
router.put("/me", auth, async (req, res) => {
  try {
    const { name, avatarUrl } = req.body;
    const update = {};
    if (name) update.name = name;
    if (avatarUrl) update.avatarUrl = avatarUrl;
    const user = await User.findByIdAndUpdate(req.user.id, update, { new: true }).select("-password");
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: "Error updating profile" });
  }
});

export default router;
