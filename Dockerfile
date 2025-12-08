# --- Stage 1: Build the Application ---
FROM node:24-alpine3.20 AS builder
WORKDIR /app
COPY package*.json ./

# 💡 ADDED: Clear npm cache before install
RUN npm install -g pnpm

# Install dependencies.
COPY prisma ./prisma
RUN pnpm install

COPY . .
# ... rest of the builder stage

# Run the build command defined in your package.json (e.g., 'tsc' or 'babel')
# Replace 'build' with your actual build script name if different
RUN pnpm run build

# --- Stage 2: Create the Final, Lean Production Image ---
# Use a production-ready, even smaller image without build tools
FROM node:24-alpine3.20 AS production

# Set the working directory
WORKDIR /app

# Copy only production dependencies from the builder stage
COPY --from=builder /app/package*.json ./

RUN npm install -g pnpm
RUN pnpm install --only=production

# Copy the built application code from the builder stage
# Assuming your built output (JS files) goes into a 'dist' or 'build' folder
# Adjust 'dist' to your actual build output directory
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/assets ./assets
# Copy 'public' for your swagger documentation file if it's not in 'dist'

# Expose the port your application listens on (8090 in your config)
EXPOSE 8090

# Command to run the application
# Replace 'index.js' with the path to your compiled entry file
CMD ["npm", "start"]