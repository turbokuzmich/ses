FROM node:20-alpine

WORKDIR /app

COPY .env db.js index.js package.json package-lock.json ./
COPY --link db.sqlite ./db.sqlite

RUN npm install

EXPOSE 3001

CMD node index.js