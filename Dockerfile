# Commands: 
# docker build -t hemengo-api-docker-build .
# docker run --rm -it --name=hemengo-api-container --env-file .env hemengo-api-docker-build

FROM node:16

# Create a hemengo-api directory inside root (/) of the container
# and copy everything that's here (app folder, package.json...) 
# to this new directory
COPY . /hemengo-api 

# Go to this new directory
WORKDIR /hemengo-api

RUN npm install

EXPOSE 3000
EXPOSE 3306

CMD npm run dev