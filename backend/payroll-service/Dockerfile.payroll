# Use official Node.js image from Docker Hub
FROM node:23

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json from the current directory into the container
COPY ./package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend service code from the current folder into the container
COPY . .

# Expose the port the app will run on
EXPOSE 3003

# Run the app
CMD ["npm", "start"]
