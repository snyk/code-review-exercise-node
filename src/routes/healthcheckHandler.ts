import { Request, Response } from "express";

export function healthcheckHandler(_: Request, res: Response): void {
  res.sendStatus(204);
  return;
}
