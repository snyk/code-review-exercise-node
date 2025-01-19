FROM node:22.12.0-alpine AS builder
RUN mkdir -p /home/node/app/ && chown -R node:node /home/node/app
WORKDIR /home/node/app

COPY --chown=node:node package*.json ./
COPY --chown=node:node tsconfig.json ./
COPY --chown=node:node src/ ./src
USER node

RUN npm install
RUN npm run build
RUN npm install --omit-dev

FROM node:22.12.0-alpine AS application
RUN mkdir -p /home/node/app/ && chown -R node:node /home/node/app
WORKDIR /home/node/app

COPY --from=builder --chown=node:node /home/node/app/dist/ ./dist
COPY --from=builder --chown=node:node /home/node/app/node_modules/ ./node_modules/

EXPOSE 3000
USER node
CMD [ "node", "dist/src/index.js" ]
