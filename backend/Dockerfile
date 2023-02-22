FROM node:17-alpine

WORKDIR /app

COPY package.json .

RUN npm install --silent && npm rebuild bcrypt

COPY . .

EXPOSE 4000

CMD ["npm", "start"]