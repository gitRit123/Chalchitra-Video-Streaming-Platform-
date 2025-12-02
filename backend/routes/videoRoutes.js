import express from "express";
import auth from "../middleware/auth.js";
import { isAdmin } from "../middleware/authMiddleware.js";
import {
  createVideo,
  listVideos,
  getVideo,
  incrementViews,
  toggleLike,
  searchVideos,
  trendingVideos,
  deleteVideo,
} from "../controllers/videoController.js";

const router = express.Router();

router.post("/", auth, createVideo);
router.get("/", listVideos);
router.get("/search", searchVideos);
router.get("/trending", trendingVideos);
router.get("/:id", getVideo);
router.post("/:id/views", incrementViews);
router.post("/:id/like", auth, toggleLike);
// Allow admin or owner to delete. Authorization enforced in controller.
router.delete("/:id", auth, deleteVideo);

export default router;