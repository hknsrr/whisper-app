# 1️⃣ Node tabanlı imaj
FROM node:20

# 2️⃣ Çalışma dizinini belirle
WORKDIR /app

# 3️⃣ Paketleri yükle (package.json ve package-lock.json)
COPY package*.json ./

RUN npm install

# 4️⃣ whisper-node kaynaklarını doğru yere taşı
# whisper-node/lib/whisper.cpp dizininde olduğundan yeni dizin yapısı oluşturuyoruz
RUN mkdir -p node_modules/whisper-node/whisper && \
    cp -r node_modules/whisper-node/lib/whisper.cpp/* node_modules/whisper-node/whisper/

# 5️⃣ whisper.cpp derlemesi
RUN apt-get update && apt-get install -y build-essential cmake ffmpeg && \
    cd node_modules/whisper-node/whisper && \
    make

# 6️⃣ Uygulama kaynaklarını kopyala
COPY . .

# 7️⃣ Portu aç
EXPOSE 3000

# 8️⃣ Başlatma komutu
CMD ["npm", "start"]
