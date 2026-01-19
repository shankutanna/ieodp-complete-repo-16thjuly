# =========================
# Build stage
# =========================
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build with default or build-time API base URL
# Can be overridden with: docker build --build-arg VITE_API_BASE_URL=http://backend:8080 ...
ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN npm run build


# =========================
# Runtime stage
# =========================
FROM nginx:alpine

# Nginx config for serving static React files only
# NO API proxying - backend is called directly from browser
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build output from build stage
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

