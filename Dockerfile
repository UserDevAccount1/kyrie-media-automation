# Kyrie Media Automation — dashboard presentation
# Build: docker build -t kyrie-media-automation .
# Run:   docker run --name kyrie-media-automation -p 8080:80 kyrie-media-automation

FROM node:24-alpine AS build
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine AS serve
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
