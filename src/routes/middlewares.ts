import type { Request, Response, NextFunction } from "express";
export function handleErrors(
  err: Error,
  _: Request,
  res: Response,
  next: NextFunction,
) {
  console.log(err);

  if (!err) next();

  // TODO: add error type check, and get status and message from error

  const code: number = err.code ?? 500;
  const message: string = err.message ?? "Unexpected error";

  res.status(code).send({ error: { message } });
}
