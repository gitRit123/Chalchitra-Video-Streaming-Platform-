import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();
// ffmpeg will be loaded dynamically inside the handler to avoid hard dependency at boot

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

router.post("/video", upload.single("video"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  const inputPath = path.join("uploads", req.file.filename);
  const base = path.parse(req.file.filename).name;
  const processedFilename = `processed-${base}.mp4`;
  const thumbFilename = `thumb-${base}.jpg`;
  const outputPath = path.join("uploads", processedFilename);
  const thumbPath = path.join("uploads", thumbFilename);

  // Transcode to H.264 1280x720 16:9 with padding when needed, and snapshot thumbnail
  try {
    // dynamic import so app can boot even if ffmpeg deps aren't installed
    let ffmpegMod;
    let ffmpegBin;
    try {
      const mod = await import("fluent-ffmpeg");
      ffmpegMod = mod.default || mod;
      const bin = await import("ffmpeg-static");
      ffmpegBin = bin.default;
      if (ffmpegBin && ffmpegMod?.setFfmpegPath) {
        ffmpegMod.setFfmpegPath(ffmpegBin);
      }
    } catch (_e) {
      ffmpegMod = null;
    }

    if (!ffmpegMod) {
      // No processing available, return original file
      const url = `/uploads/${req.file.filename}`;
      return res.json({ message: "Video uploaded (processing unavailable)", url });
    }

    await new Promise((resolve, reject) => {
      ffmpegMod(inputPath)
        .videoCodec("libx264")
        .size("?x720")
        .autopad(true, "black") // ensure 16:9 letterboxing if needed
        .outputOptions([
          "-preset veryfast",
          "-movflags +faststart",
        ])
        .on("error", reject)
        .on("end", resolve)
        .save(outputPath);
    });

    await new Promise((resolve, reject) => {
      ffmpegMod(inputPath)
        .on("error", reject)
        .on("end", resolve)
        .screenshots({
          count: 1,
          timemarks: ["1"],
          filename: thumbFilename,
          folder: "uploads",
          size: "1280x720",
        });
    });

    // Optionally remove the original file
    fs.unlink(inputPath, () => {});

    const url = `/uploads/${processedFilename}`;
    const thumbnailUrl = `/uploads/${thumbFilename}`;
    res.json({ message: "Video uploaded and processed", url, thumbnailUrl });
  } catch (err) {
    // Fallback: serve original file in case ffmpeg fails
    const url = `/uploads/${req.file.filename}`;
    res.json({ message: "Video uploaded (processing failed)", url });
  }
});

// upload thumbnail image
router.post("/thumbnail", upload.single("thumbnail"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  const ext = path.extname(req.file.originalname).toLowerCase();
  const allowed = [".jpg", ".jpeg", ".png", ".webp"];
  if (!allowed.includes(ext)) {
    return res.status(400).json({ error: "Unsupported image type" });
  }
  const url = `/uploads/${req.file.filename}`;
  res.json({ message: "Thumbnail uploaded successfully", url });
});

export default router;