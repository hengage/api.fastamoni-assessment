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

# Run migrations
RUN pnpm migration:run

# Expose port
EXPOSE 3001

CMD ["sh", "-c", "pnpm migration:run && pnpm start"]