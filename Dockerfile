FROM ubuntu:latest

RUN apt update \
     && apt install -y wget gnupg ca-certificates \
     && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
     && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
     && apt update \
     && apt install -y google-chrome-stable \

RUN apt install software-properties-common -y
RUN add-apt-repository ppa:savoury1/ffmpeg4
RUN apt update
RUN apt install ffmpeg -y
RUN apt install npm -y

WORKDIR /app
COPY . /app
RUN npm install
CMD ["npm", "start"]
EXPOSE 8080