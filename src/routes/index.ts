import express from "express";
import { getPackage } from "../service/handler";
import { handleErrors } from "./middlewares";
import { healthCheckHandler } from "../service/handler/healthcheck";

export function mountRoutes(): express.Express {
  const app = express();

  app.use(express.json());

  app.get("/healthcheck", healthCheckHandler);
  app.get("/package/:name/:version", getPackage);

  app.use(handleErrors);

  return app;
}
