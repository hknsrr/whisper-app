FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN apt-get update && apt-get install -y build-essential python3 ffmpeg

RUN npm install

COPY . .

RUN cd node_modules/whisper-node/whisper && make

EXPOSE 3000
CMD ["node", "src/index.js"]
