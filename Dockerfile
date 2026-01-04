FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3001

CMD ["sh", "-c", "if [ \"$NODE_ENV\" = \"development\" ]; then pnpm start:dev; else pnpm start; fi"]
