# Stage 1: Build
ARG NODE_VERSION=8.1.4-alpine
FROM node:${NODE_VERSION} AS builder

# Set working directory
WORKDIR /app

# Install Yarn globally
RUN npm install -g yarn

# Copy package files and install dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Copy source files and build the application
COPY . ./
RUN yarn build

# Stage 2: Serve
FROM nginx:stable-alpine

# Copy custom Nginx configuration files
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/nginx.vh.default.conf /etc/nginx/conf.d/default.conf

# Copy built application from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose the default Nginx port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
