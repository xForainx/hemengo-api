FROM node:16
WORKDIR /hemengo-api
COPY package.json ./
COPY . .
RUN npm install
EXPOSE 3000
CMD npm run dev