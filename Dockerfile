FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

# whisper-node derleme araçları
RUN apt-get update && apt-get install -y build-essential cmake ffmpeg

# whisper.cpp dosyalarını dist klasörünün yanına kopyala
RUN mkdir -p node_modules/whisper-node/dist/whisper && \
    cp -r node_modules/whisper-node/lib/whisper.cpp/* node_modules/whisper-node/dist/whisper/

# whisper derlemesi
RUN cd node_modules/whisper-node/dist/whisper && make

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
