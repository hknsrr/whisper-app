import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import whisper from "whisper-node"; // v1.1.1 sürümünü kullanıyoruz

const app = express();
const upload = multer({ dest: "/tmp/uploads" });

app.get("/", (req, res) => {
  res.send("🎧 Whisper transcription service is running!");
});

app.post("/transcribe", upload.single("audio"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No audio file uploaded." });
  }

  const filePath = path.resolve(req.file.path);

  try {
    console.log(`[Whisper] Transcribing file: ${filePath}`);

    // whisper-node .wav formatı ister; MP3'ü otomatik dönüştürür
    const transcript = await whisper(filePath, {
      modelName: "base.en", // küçük model, Render free plan’da çalışır
      whisperOptions: {
        language: "auto",
        word_timestamps: false,
        gen_file_txt: true
      }
    });

    // Eğer .txt dosyası oluşturulduysa onu da oku
    const txtPath = filePath.replace(/\.[^/.]+$/, ".txt");
    let textOutput = "No text file generated.";
    if (fs.existsSync(txtPath)) {
      textOutput = fs.readFileSync(txtPath, "utf8");
    }

    res.json({
      message: "Transcription completed successfully.",
      transcript,
      textOutput
    });
  } catch (error) {
    console.error("[Whisper] Error:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`✅ Whisper server running on port ${PORT}`)
);
