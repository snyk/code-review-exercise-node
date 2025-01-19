import express from "express";
import { getPackageHandler } from "./getPackageHandler";
import { healthCheckHandler } from "./healthcheckHandler";
import { handleErrors } from "./middlewares";
import { PackageGetter } from "../domain/types";

export function createApp(packageGetter: PackageGetter): express.Express {
  const app = express();

  app.use(express.json());

  app.get("/healthcheck", healthCheckHandler);
  app.get("/package/:name/:version", getPackageHandler(packageGetter));

  app.use(handleErrors);

  return app;
}
