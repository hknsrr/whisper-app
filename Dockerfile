FROM node:20-bullseye

WORKDIR /usr/src/app

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential cmake wget git ffmpeg python3 ca-certificates && \
    rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci --production

COPY . .

EXPOSE 3000
CMD ["npm", "start"]
