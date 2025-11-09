# 1️⃣ Python ortamı
FROM python:3.10-slim

# 2️⃣ Sistem bağımlılıkları
RUN apt-get update && apt-get install -y git ffmpeg && rm -rf /var/lib/apt/lists/*

# 3️⃣ Çalışma dizini
WORKDIR /app

# 4️⃣ Gereksinim dosyası
COPY requirements.txt .

# 5️⃣ Pip güncelle
RUN python3 -m pip install --upgrade pip

# 6️⃣ Bağımlılıkları yükle
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install torch torchaudio flask flask-cors ffmpeg-python && \
    pip install git+https://github.com/openai/whisper.git

# 7️⃣ Kodları (sadece başlangıç için) kopyala
COPY app.py /app/app.py
COPY static /app/static

# 8️⃣ Ortam değişkenleri
ENV WHISPER_MODEL=base
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=5000
ENV FLASK_DEBUG=1

EXPOSE 5000

# 9️⃣ Flask dev server
CMD ["flask", "run"]
