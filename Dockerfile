FROM node:13.5.0

RUN mkdir /app
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN chown -R node.node /app

USER node 

RUN npm run build

CMD [ "npm", "run", "start" ]