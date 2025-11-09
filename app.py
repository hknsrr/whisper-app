import os
import whisper
import uuid
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__, static_folder="static")
CORS(app)

MODEL_NAME = os.environ.get("WHISPER_MODEL", "base")
print(f"Loading Whisper model: {MODEL_NAME}")

device = "cuda" if whisper.torch.cuda.is_available() else "cpu"
model = whisper.load_model(MODEL_NAME, device=device)
print(f"Model loaded on {device}")

@app.route("/")
def index():
    return app.send_static_file("index.html")

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "device": device, "model": MODEL_NAME})

@app.route("/transcribe", methods=["POST"])
def transcribe():
    if "file" not in request.files:
        return jsonify({"error": "missing 'file' field"}), 400

    timestamp_flag = request.args.get("timestamp", "true").lower() == "true"
    audio_file = request.files["file"]
    tmp_name = f"/tmp/{uuid.uuid4().hex}_{audio_file.filename}"
    audio_file.save(tmp_name)

    try:
        result = model.transcribe(tmp_name, language="tr", task="transcribe")

        if timestamp_flag:
            lines = []
            for seg in result.get("segments", []):
                start = int(seg["start"])
                minutes = start // 60
                seconds = start % 60
                timestamp = f"{minutes:02d}:{seconds:02d}"
                lines.append(f"{timestamp} — {seg['text'].strip()}")
            output = "\n".join(lines)
        else:
            output = result.get("text", "").strip()

        return output, 200, {"Content-Type": "text/plain; charset=utf-8"}

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        try:
            os.remove(tmp_name)
        except:
            pass

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)