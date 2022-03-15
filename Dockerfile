FROM node:16
WORKDIR /hemengo-api
COPY package.json .
COPY . .
EXPOSE 3000