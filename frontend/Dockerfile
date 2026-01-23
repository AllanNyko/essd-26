FROM node:20-alpine

WORKDIR /app

# Install deps first (when package files exist)
COPY package*.json ./
RUN if [ -f package.json ]; then npm install; fi

# Copy app
COPY . .

# Default dev command (CRA)
CMD ["npm", "start"]
