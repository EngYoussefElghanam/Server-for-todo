# Use official Node.js runtime
FROM node:20

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# Expose your server's port
EXPOSE 2000

# Start the server
CMD ["node", "server.js"]
