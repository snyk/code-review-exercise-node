import type { Request, Response, NextFunction } from "express";
import { AxiosError } from "axios";
import pino from "pino";

const logger = pino();
const UNEXPECTED_ERROR_MESSAGE = "Unexpected error";
const INTERNAL_SERVER_ERROR_STATUS_CODE = 500;

export function handleErrors(
  err: Error,
  _: Request,
  res: Response,
  next: NextFunction,
) {
  logger.error(err);

  if (!err) next();

  if (err instanceof AxiosError) {
    const code = err.code
      ? Number(err.code)
      : INTERNAL_SERVER_ERROR_STATUS_CODE;
    const message: string = err.message;
    res.status(code).send({ error: { message } });
  } else {
    res
      .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
      .send({ error: { UNEXPECTED_ERROR_MESSAGE } });
  }
}
