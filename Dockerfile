# 1️⃣ Temel imaj: Node 18 (Debian tabanlı, Whisper derlemesiyle uyumlu)
FROM node:18-bullseye

# 2️⃣ Sistem bağımlılıklarını yükle (Whisper için gerekli)
# ffmpeg + cmake yükle
RUN apt-get update && apt-get install -y \
    ffmpeg \
    cmake \
    build-essential \
    python3

# 3️⃣ Çalışma dizini oluştur
WORKDIR /usr/src/app

# 4️⃣ Paket dosyalarını kopyala
COPY package*.json ./

# 5️⃣ Bağımlılıkları yükle (lock dosyasını kontrol etmeden)
RUN npm install --omit=dev

# 6️⃣ Uygulama dosyalarını kopyala
COPY . .

# 7️⃣ Whisper.cpp’in make işlemini garantiye al (bazı sistemlerde gerekebilir)
RUN cd node_modules/whisper-node/whisper && make || echo "make skipped"

# 8️⃣ Uygulama portunu aç
EXPOSE 3000

# 9️⃣ Uygulamayı başlat
CMD ["npm", "start"]

