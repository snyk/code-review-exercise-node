import { Server } from "http";
import { createApp } from "../src/routes/app";
import { PackageGetter } from "../src/domain/types";

export function setupServerForTest(packageGetter: PackageGetter): Server {
  const app = createApp(packageGetter);
  const server = app.listen();

  return server;
}

export class InMemoryPackageGetter {
  private packageStore: Record<
    string,
    Record<string, Record<string, string> | undefined>
  > = {};

  setDependenciesForPackageAndVersion(
    packageName: string,
    packageVersion: string,
    dependencies?: Record<string, string>,
  ) {
    this.packageStore[packageName] = {
      ...this.packageStore[packageName],
      [packageVersion]: dependencies,
    };
  }

  getPackageGetter(): PackageGetter {
    return async (packageName: string) => {
      const versions = this.packageStore[packageName];
      return {
        name: packageName,
        versions: Object.fromEntries(
          Object.keys(versions ?? {}).map((v) => {
            return [
              v,
              { name: packageName, version: v, dependencies: versions[v] },
            ];
          }),
        ),
      };
    };
  }
}
