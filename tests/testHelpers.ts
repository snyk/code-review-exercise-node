import { Server } from "http";
import { createApp } from "../src/routes/app";
import { NPMPackage, PackageGetter } from "../src/domain/types";

export function setupServerForTest(packageGetter: PackageGetter): Server {
  const app = createApp(packageGetter);
  const server = app.listen();

  return server;
}
export const generatePackage = (
  name: string,
  version: string,
  dependencies: Record<string, string>,
): NPMPackage => ({
  name,
  description: "",
  "dist-tags": {},
  versions: {
    [version]: {
      name,
      version,
      dependencies,
    },
  },
});
