import { getPackageDependencies } from "../../src/domain/getPackageDependencies";
import { InMemoryPackageGetterFactory } from "../testHelpers";
import { PackageVersionNotFoundError } from "../../src/domain/errors";

const packageName = "react";
const packageVersion = "16.3.0";

/*
  Test cases we do not currently cover:
  - Empty or invalid range for dependencies
  - Error when getPackage function throws an error: there should be tests to ensure that it is appropriately handled.
  - Circular dependencies:This could potentially cause an infinite loop or stack overflow.
  - Handling missing dependencies: The current code assumes that all dependencies exist in the getPackage function call. There should be a test to check if getPackage returns an empty or incomplete set of versions for a package.
  - Dependencies with different versions across packages: could be helpful to test scenarios where a dependency appears with different versions across different packages. 

*/
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
