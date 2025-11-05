FROM node:18

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y \
    ffmpeg \
    make \
    cmake \
    build-essential \
    python3

COPY package*.json ./
RUN npm install

COPY . .

RUN npx whisper-node download

EXPOSE 3000
CMD ["npm", "start"]
