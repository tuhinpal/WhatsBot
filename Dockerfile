FROM errorshivansh/WhatsBot:latest

RUN apt update
RUN apt install ffmpeg -y

WORKDIR /app
COPY . /app
RUN npm install
CMD ["npm", "start"]
EXPOSE 8080
