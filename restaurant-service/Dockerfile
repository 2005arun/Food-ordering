FROM node:18-alpine

WORKDIR /app

COPY .npmrc ./
COPY package.json package-lock.json* ./

RUN npm ci --only=production 2>&1 || npm install --production

COPY . .

EXPOSE 3002

CMD ["node", "src/server.js"]
