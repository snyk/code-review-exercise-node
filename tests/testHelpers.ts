import { Server } from "http";
import { createApp } from "../src/routes/app";
import {
  PackageGetter,
  PackageName,
  PackageRange,
  PackageVersion,
} from "../src/domain/types";

export function setupServerForTest(packageGetter: PackageGetter): Server {
  const app = createApp(packageGetter);
  const server = app.listen();

  return server;
}

export class InMemoryPackageGetterFactory {
  private packageStore: Record<
    PackageName,
    Record<PackageVersion, Record<PackageName, PackageRange> | undefined>
  > = {};

  setDependenciesForPackageAndVersion(
    packageName: string,
    packageVersion: string,
    dependencies?: Record<PackageName, PackageVersion>,
  ) {
    this.packageStore[packageName] = {
      ...this.packageStore[packageName],
      [packageVersion]: dependencies,
    };
  }

  getPackageGetter(): PackageGetter {
    return async (packageName: PackageName) => {
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
