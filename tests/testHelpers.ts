import { Server } from "http";
import { createApp } from "../src/routes";
import { PackageGetter } from "../src/service/package";

export function setupServerForTest(packageGetter: PackageGetter): Server {
  const app = createApp(packageGetter);
  const server = app.listen();

  return server;
}
