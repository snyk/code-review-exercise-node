import type { Request, Response, NextFunction } from "express";
import pino from "pino";
import { PackageNotFoundError } from "../domain/errors";

const logger = pino();

export function handleErrors(
  error: Error,
  _: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  __: NextFunction,
): void {
  if (error instanceof PackageNotFoundError) {
    res.status(404);
    res.send({
      error: { message: "Package not found", packageName: error.packageName },
    });
    return;
  } else {
    logger.error({ error }, "Internal server error");

    res.status(500);
    res.send({ error: { message: "Internal server error" } });
  }
}

export function notFoundHandler(
  _: Request,
  res: Response,
  next: NextFunction,
): void {
  res.status(404);
  res.send({ error: { message: "Not found" } });
  next();
}
