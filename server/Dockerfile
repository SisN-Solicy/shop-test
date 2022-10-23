FROM node:12.17.0-alpine

WORKDIR /app

COPY package.json ./
COPY tsconfig.json ./
COPY src ./src

RUN ls -a
RUN npm install

EXPOSE 5000

CMD ["npm","run","dev"]