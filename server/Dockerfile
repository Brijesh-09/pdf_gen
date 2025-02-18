# Use the official Node.js image as the base image
FROM node:18-slim

# Install dependencies for Puppeteer
# Required: libgconf-2-4
# Recommended: other packages for better compatibility
RUN apt-get update && apt-get install -y \
    wget \
    curl \
    gnupg \
    libgconf-2-4 \
    libx11-6 \
    libx11-xcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxtst6 \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libxshmfence1 \
    lsb-release \
    xdg-utils \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*


# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json to install dependencies
COPY package.json package-lock.json ./

# Install dependencies for Next.js
RUN npm install

# Copy the rest of the app files
COPY . .


RUN mkdir -p /pdfs

# Expose port 80 for the Node.js server
EXPOSE 5000

# Start the Node.js server
CMD ["npm", "start"]
