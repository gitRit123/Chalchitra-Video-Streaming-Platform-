import express from "express";
import auth from "../middleware/auth.js";
import { addComment, listComments } from "../controllers/commentController.js";

const router = express.Router();

router.post("/:videoId", auth, addComment);
router.get("/:videoId", listComments);

export default router;