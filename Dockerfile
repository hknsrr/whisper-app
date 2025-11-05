# 1. Node tabanlı imaj
FROM node:18

# 2. Make ve build araçlarını kur
RUN apt-get update && apt-get install -y build-essential cmake ffmpeg

# 3. Uygulama dizini oluştur
WORKDIR /usr/src/app

# 4. Package dosyalarını kopyala
COPY package*.json ./

# 5. Bağımlılıkları yükle
RUN npm install

# 6. Model dosyasını indir (örnek: tiny model)
RUN npx whisper-node download tiny

# 7. Geri kalan dosyaları kopyala
COPY . .

# 8. Uygulamayı başlat
EXPOSE 3000
CMD ["npm", "start"]
