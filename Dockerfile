# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --silent
COPY . .
RUN npm run build

# Production stage - nginx
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
# Remove default nginx config and provide a simple one that forwards /api to backend via proxy_pass if needed
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
