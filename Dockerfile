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

# Build the application
RUN pnpm build

# Verify the build output exists
RUN ls -la dist/

# Expose port
EXPOSE 3001

CMD ["sh", "-c", "pnpm migration:run && node dist/src/main.js"]