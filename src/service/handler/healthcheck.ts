import { Request, Response } from "express";

export function healthCheckHandler(_: Request, res: Response): void {
  res.sendStatus(204);
  return;
}
