import express from "express";
import { getPackageHandler } from "./getPackageHandler";
import { healthcheckHandler } from "./healthcheckHandler";
import { handleErrors, notFoundHandler } from "./middlewares";
import { PackageGetter } from "../domain/types";

export function createApp(packageGetter: PackageGetter): express.Express {
  const app = express();

  app.use(express.json());

  app.get("/healthcheck", healthcheckHandler);
  app.get(
    "/package/:packageName/:packageVersion",
    getPackageHandler(packageGetter),
  );

  app.use("*", notFoundHandler);
  app.use(handleErrors);

  return app;
}
