FROM node:alpine

# prepare
RUN apk add --no-cache \
  chromium \
  ca-certificates \
  ffmpeg

# skip installing chrome
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
  PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app
COPY . /app
RUN npm install
CMD ["npm", "start"]
EXPOSE 8080
