import { Server } from "http";
import { createApp } from "../src/routes/app";
import { PackageGetter } from "../src/domain/types";

export function setupServerForTest(packageGetter: PackageGetter): Server {
  const app = createApp(packageGetter);
  const server = app.listen();

  return server;
}
