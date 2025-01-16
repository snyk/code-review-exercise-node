import { Server } from "http";
import { createApp } from "../routes";
import { PackageGetter } from "../service/package";

export function setupServerForTest(packageGetter: PackageGetter): Server {
  const app = createApp(packageGetter);
  const server = app.listen();

  return server;
}
