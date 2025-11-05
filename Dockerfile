FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN apt-get update && apt-get install -y build-essential cmake ffmpeg

# whisper-node içindeki whisper kaynaklarını /app/whisper klasörüne kopyala
RUN mkdir -p /app/whisper && \
    cp -r node_modules/whisper-node/lib/whisper.cpp/* /app/whisper/

# whisper.cpp dosyalarını derle
RUN cd /app/whisper && make

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
