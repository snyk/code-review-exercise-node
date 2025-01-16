import * as express from "express";
import { getPackageHandler } from "../service/handler/getPackage";
import { handleErrors } from "./middlewares";
import { healthCheckHandler } from "../service/handler/healthcheck";
import { PackageGetter } from "../service/package";

export function createApp(packageGetter: PackageGetter): express.Express {
  const app = express();

  app.use(express.json());

  app.get("/healthcheck", healthCheckHandler);
  app.get("/package/:name/:version", getPackageHandler(packageGetter));

  app.use(handleErrors);

  return app;
}
