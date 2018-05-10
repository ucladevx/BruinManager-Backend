# TODO: get nodemon working
FROM node:9.11.1-alpine

# Create app directory
WORKDIR /usr/src/app

# TODO: idk what this does
ENV PATH /usr/src/node_modules/.bin:$PATH

# Install nodemon
RUN npm install --global nodemon

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

EXPOSE 3000

# CMD [ "npm", "start" ]
CMD ["nodemon","--legacy-watch"]
