FROM node:18-alpine as builder

WORKDIR /app

COPY .npmrc ./
COPY package.json package-lock.json* ./

RUN npm ci 2>&1 || npm install

COPY . .

RUN npm run build

FROM node:18-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 5173

CMD ["serve", "-s", "dist", "-l", "5173", "--host", "0.0.0.0"]
