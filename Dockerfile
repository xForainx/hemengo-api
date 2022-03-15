FROM node:16
WORKDIR /hemengo-api
COPY package.json .
COPY . .
EXPOSE 3000
RUN npm install
CMD sleep 10 ; npm start