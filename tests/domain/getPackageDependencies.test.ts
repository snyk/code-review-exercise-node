import { getPackageDependencies } from "../../src/domain/getPackageDependencies";
import { InMemoryPackageGetterFactory } from "../testHelpers";
import { PackageVersionNotFoundError } from "../../src/domain/errors";

const packageName = "react";
const packageVersion = "16.3.0";

describe("getPackageDependencies", () => {
  it("returns dependencies for valid package + version", async () => {
    const packageGetter = new InMemoryPackageGetterFactory();

    const dependencies = {
      "loose-envify": "1.1.0",
    };

    packageGetter.setDependenciesForPackageAndVersion(
      packageName,
      packageVersion,
      dependencies,
    );
    packageGetter.setDependenciesForPackageAndVersion("loose-envify", "1.1.0");

    const resolvedDependencies = await getPackageDependencies(
      packageName,
      packageVersion,
      packageGetter.getPackageGetter(),
    );

    expect(resolvedDependencies).toStrictEqual({ ["loose-envify"]: "1.1.0" });
  });

  it("returns maxSatisfying version for a dependency range", async () => {
    const packageGetter = new InMemoryPackageGetterFactory();

    const dependencies = {
      "loose-envify": "^1.1.0",
    };

    packageGetter.setDependenciesForPackageAndVersion(
      packageName,
      packageVersion,
      dependencies,
    );
    packageGetter.setDependenciesForPackageAndVersion("loose-envify", "1.1.0");
    packageGetter.setDependenciesForPackageAndVersion("loose-envify", "1.2.0");
    packageGetter.setDependenciesForPackageAndVersion("loose-envify", "1.3.0");
    packageGetter.setDependenciesForPackageAndVersion("loose-envify", "1.3.5");

    const resolvedDependencies = await getPackageDependencies(
      packageName,
      packageVersion,
      packageGetter.getPackageGetter(),
    );

    expect(resolvedDependencies).toStrictEqual({ ["loose-envify"]: "1.3.5" });
  });

  it("falls back to version range when matching version does not exist for dependency", async () => {
    const packageGetter = new InMemoryPackageGetterFactory();

    const dependencies = {
      "loose-envify": "^1.1.0",
    };

    packageGetter.setDependenciesForPackageAndVersion(
      packageName,
      packageVersion,
      dependencies,
    );

    const resolvedDependencies = await getPackageDependencies(
      packageName,
      packageVersion,
      packageGetter.getPackageGetter(),
    );

    expect(resolvedDependencies).toStrictEqual({ ["loose-envify"]: "^1.1.0" });
  });

  it("handles package without dependencies", async () => {
    const packageGetter = new InMemoryPackageGetterFactory();

    packageGetter.setDependenciesForPackageAndVersion(
      packageName,
      packageVersion,
    );

    const resolvedDependencies = await getPackageDependencies(
      packageName,
      packageVersion,
      packageGetter.getPackageGetter(),
    );
    expect(resolvedDependencies).toStrictEqual({});
  });

  it("throws PackageVersionNotFound error for non existing version", () => {
    const packageGetter = new InMemoryPackageGetterFactory();

    packageGetter.setDependenciesForPackageAndVersion(
      packageName,
      packageVersion,
    );

    expect(
      getPackageDependencies(
        packageName,
        "non-existing-version",
        packageGetter.getPackageGetter(),
      ),
    ).rejects.toThrow(PackageVersionNotFoundError);
  });
});
