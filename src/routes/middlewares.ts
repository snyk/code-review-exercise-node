import type { Request, Response, NextFunction } from "express";
import pino from "pino";
import {
  PackageNotFoundError,
  PackageVersionNotFoundError,
} from "../domain/errors";

const logger = pino();

/**
 * Express middleware which maps domain errors to status
 * codes with a meaningful error message.
 */
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
  }
  if (error instanceof PackageVersionNotFoundError) {
    res.status(404);
    res.send({
      error: {
        message: "Requested version for package not found",
        packageName: error.packageName,
        packageVersion: error.packageVersion,
      },
    });
  } else {
    logger.error({ error }, "Internal server error");

    res.status(500);
    res.send({ error: { message: "Internal server error" } });
  }
}

/**
 * Express middleware which ensure that a non-existing route is
 * returning a 404 status code and a json response with an error.
 */
export function notFoundHandler(
  _: Request,
  res: Response,
  next: NextFunction,
): void {
  res.status(404);
  res.send({ error: { message: "Not found" } });
  next();
}
