FROM node:22.12.0-alpine AS builder
RUN mkdir -p /home/node/app/ && chown -R node:node /home/node/app
WORKDIR /home/node/app
USER node

COPY package.json ./
COPY --chown=node:node package-lock.json ./
COPY tsconfig.json ./
COPY src/ ./src

RUN npm ci
RUN npm run build
RUN npm prune --production

FROM node:22.12.0-alpine AS application
RUN mkdir -p /home/node/app/ && chown -R node:node /home/node/app
WORKDIR /home/node/app
USER node

COPY --from=builder /home/node/app/dist/ ./dist
COPY --from=builder /home/node/app/node_modules/ ./node_modules/

EXPOSE 3000
CMD [ "node", "dist/index.js" ]
