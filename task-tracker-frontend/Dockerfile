#Use lightweight Node.js image
From node:16-alpha AS builder

#set working directory
WORKDIR /app

#copy package file for caching
COPY package*.json ./

#install production dependencies
RUN npm install 

#copy app code
COPY . .

RUN npm run build

#production stage: server with NGINX
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]