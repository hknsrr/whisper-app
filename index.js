import path from "path";
import { nodewhisper } from "nodejs-whisper";

const filePath = path.resolve("./sample.mp3"); // kendi ses dosyanı buraya koy

(async () => {
  console.log("Transcription starting...");

  await nodewhisper(filePath, {
    modelName: "base.en", // İngilizce için
    autoDownloadModelName: "base.en",
    removeWavFileAfterTranscription: false,
    withCuda: false, // CPU için false kalmalı
    logger: console,
    whisperOptions: {
      outputInSrt: true, // altyazı çıktısı
      outputInText: true, // .txt çıktısı
      translateToEnglish: false,
      wordTimestamps: false,
    },
  });

  console.log("✅ Transcription completed!");
})();
