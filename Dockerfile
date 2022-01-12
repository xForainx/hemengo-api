FROM node:latest

# Create a hemengo-api directory inside root (/) of the container
# and copy everything that's here (app folder, package.json...) 
# to this new directory
COPY . /hemengo-api 

# Go to this new directory
WORKDIR /hemengo-api

# TODO: pass the .env file to the container, so Sequelize can use db creds

# RUN npm install

# EXPOSE 3000

# CMD npm run dev