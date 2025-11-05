import express from "express";
import multer from "multer";
import whisper from "whisper-node";
import fs from "fs";

const app = express();
const upload = multer({ dest: "uploads/" });

app.get("/", (req, res) => {
  res.send("🎧 Whisper-node 1.1.1 app is running!");
});

app.post("/transcribe", upload.single("audio"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const filePath = req.file.path;
  console.log("🎵 Received file:", filePath);

  try {
    const transcript = await whisper(filePath, {
      modelName: "base.en",
      whisperOptions: {
        language: "auto",
        word_timestamps: true
      }
    });

    fs.unlinkSync(filePath); // delete uploaded file after transcription

    res.json({
      success: true,
      transcript
    });
  } catch (err) {
    console.error("❌ Transcription failed:", err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
