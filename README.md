# README

A web server that provides a HTTP API to query the dependency tree of an [npm](https://www.npmjs.com/) package.

## Prerequisites

- [Node v22](https://nodejs.org/en/download)

## Getting started

To install dependencies and start the server in development mode:

```bash
npm install
npm start
```

The server will start on port 3000 and will restart on changes to the files in `./src/`.

The server contains two endpoints - `/healthcheck` and `/package/:packageName/:packageVersion`.
You can fetch the dependencies for `react@16.3.0` via:

```bash
curl http://localhost:3000/package/react/16.13.0 | jq .
```

## Testing

You can run the test suite with this command:

```bash
npm run test
```

The project contains unit, integration and end-to-end tests, located in `/tests`. You can execute them separately:

```bash
npm run test:unit
npm run test:integration
npm run test:e2e
```

## Type checking - tsc

The project uses typescript for type checking. You can run typescript via:

```bash
npm run build
```

Typescript will also transpile the code to javascript. You can find the transpiled code in `./dist/`.

## Linting

The code is linted using eslint. You can run the linter via:

```bash
npm run lint
```

## Formatting

The code is formatted using prettier. You can format the code via:

```bash
npm run format
```

## Run the application as a docker container

You can build a docker image and run a containerized version of the application:

```bash

```
