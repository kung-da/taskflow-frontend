FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production: serve with nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Inject runtime env via entrypoint (VITE_ vars are baked at build time)
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
