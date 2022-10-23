FROM node:12.17.0-alpine

WORKDIR /app

COPY package.json ./
COPY ./ ./

RUN ls -a
RUN npm install

EXPOSE 5000

CMD ["npm","run","start"]