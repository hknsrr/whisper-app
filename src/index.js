import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import whisper from "whisper-node";
import { execSync } from "child_process";

const app = express();
const upload = multer({ dest: "/tmp/uploads" });

app.get("/", (req, res) => {
  res.send("🎧 Whisper transcription service is running!");
});

app.post("/transcribe", upload.single("audio"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No audio file uploaded." });
  }

  const originalPath = path.resolve(req.file.path);
  const wavPath = originalPath.replace(/\.[^/.]+$/, ".wav");

  try {
    // MP3 → WAV dönüşümü (whisper-node .wav ister)
    console.log(`[FFmpeg] Converting ${originalPath} → ${wavPath}`);
    execSync(`ffmpeg -y -i ${originalPath} -ar 16000 ${wavPath}`);

    console.log(`[Whisper] Transcribing file: ${wavPath}`);
    const transcript = await whisper(wavPath, {
      modelName: "base.en", // küçük model, Render free plan’da çalışır
      whisperOptions: {
        language: "auto",
        word_timestamps: false,
        gen_file_txt: true
      }
    });

    const txtPath = wavPath.replace(/\.[^/.]+$/, ".txt");
    let textOutput = "No text file generated.";
    if (fs.existsSync(txtPath)) {
      textOutput = fs.readFileSync(txtPath, "utf8");
    }

    res.json({
      message: "✅ Transcription completed successfully.",
      transcript,
      textOutput
    });
  } catch (error) {
    console.error("[Whisper] Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Render ortamı için port ayarı
const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Whisper server running on port ${PORT}`);
});
