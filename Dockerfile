FROM node:8
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
EXPOSE 3000
EXPOSE 27017
CMD [ "npm", "run", "docker" ]
