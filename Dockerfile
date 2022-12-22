# Description: Dockerfile for NestJS application
FROM node:16-alpine as development

# Update NPM version
RUN npm install npm @nestjs/cli -g

# Create app directory
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# Copying this first prevents re-running npm install on every code change.
COPY package*.json ./

# Install app dependencies using the `npm ci` command instead of `npm install`
RUN npm install

# Bundle app source
COPY . .

# Run the web service on container startup
CMD [ "npm", "run", "start:dev" ]
