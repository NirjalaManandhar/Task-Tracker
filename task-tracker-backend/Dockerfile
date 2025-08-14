#Use lightweight Node.js image
From node:16-alpha

#set working directory
WORKDIR /app

#copy package file for caching
COPY package*.json ./

#install production dependencies
RUN npm install --production

#copy app code
COPY . .

#expose port
EXPOSE 5000

#start the app
CMD ["node", "server.js"]
