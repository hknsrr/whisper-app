import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { nodewhisper } from "nodejs-whisper";

const app = express();
const upload = multer({ dest: "/tmp/uploads" });

app.get("/", (req, res) => {
  res.send("Whisper app is running!");
});

app.post("/transcribe", upload.single("audio"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No audio file uploaded" });
  }

  const filePath = path.resolve(req.file.path);

  try {
    await nodewhisper(filePath, {
      modelName: "tiny", // küçük model, Render free plan’da çalışır
      autoDownloadModelName: "tiny",
      removeWavFileAfterTranscription: false,
      withCuda: false,
      logger: console,
      whisperOptions: {
        outputInText: true
      }
    });

    const txtPath = filePath.replace(/\.[^/.]+$/, ".txt");
    const transcript = fs.existsSync(txtPath)
      ? fs.readFileSync(txtPath, "utf8")
      : "No text output found";

    res.json({ transcript });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
