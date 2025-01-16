import express from "express";
import { getPackage } from "../service/handler";
import { handleErrors } from "./middlewares";

export function mountRoutes(): express.Express {
  const app = express();

  app.use(express.json());

  app.get("/package/:name/:version", getPackage);

  app.use(handleErrors);

  return app;
}
