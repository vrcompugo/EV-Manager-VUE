FROM node:13.5.0

RUN mkdir /app
WORKDIR /app
RUN chown node.node .

USER node
COPY package*.json ./
RUN npm install

COPY . .

USER root
RUN chown -R node.node $(ls -a -Inode_modules -I.. -I.)

USER node

ARG API_URL
RUN echo ${API_URL}

RUN npm run build

CMD [ "npm", "run", "start" ]
