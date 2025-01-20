import { getPackageDependencies } from "./getPackage";
import { presetPackageInfo } from "./fakePackageGetter";
import { NPMPackage } from "./types";
import { generatePackage } from "./testHelpers";
import { PackageVersionNotFoundError } from "./errors";

describe("getPackageDependencies", () => {
  it("returns dependencies for valid package + version", async () => {
    const packageName = "react";
    const version = "16.3.0";

    const innerName = "loose-envify";
    const innerVersion = "1.1.0";

    const originalDependencies = {
      [innerName]: innerVersion,
    };

    const requestedPackage: NPMPackage = generatePackage(
      packageName,
      version,
      originalDependencies,
    );
    const innerPackage = generatePackage(innerName, innerVersion, {});

    const packageGetter = presetPackageInfo({
      [packageName]: requestedPackage,
      [innerName]: innerPackage,
    });

    const dependencies = await getPackageDependencies(
      packageName,
      version,
      packageGetter,
    );

    expect(dependencies).toStrictEqual({ [innerName]: innerVersion });
  });

  it("throws PackageVersionNotFound error for non existing version", () => {
    const packageName = "react";
    const version = "non-existing-version";

    const packageWithVersion: NPMPackage = generatePackage(
      packageName,
      "existing-version",
      {},
    );
    const packageGetter = presetPackageInfo({
      [packageName]: packageWithVersion,
    });

    expect(
      getPackageDependencies(packageName, version, packageGetter),
    ).rejects.toThrow(PackageVersionNotFoundError);
  });
});
