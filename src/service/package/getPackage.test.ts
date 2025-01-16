import { getPackageDependencies, NPMPackage } from "./";
import { presetPackageInfo } from "./fakePackageGetter";

test("getPackageDependencies with valid package returns it", async () => {
  const name = "react";
  const version = "16.3.0";

  const innerName = "loose-envify";
  const innerVersion = "1.1.0";

  const originalDependencies = {
    [innerName]: innerVersion,
  };

  const requestedPackage: NPMPackage = generatePackage(
    name,
    version,
    originalDependencies,
  );
  const innerPackage = generatePackage(innerName, innerVersion, {});

  const packageGetter = presetPackageInfo({
    [name]: requestedPackage,
    [innerName]: innerPackage,
  });

  const dependencies = await getPackageDependencies(
    name,
    version,
    packageGetter,
  );

  expect(dependencies).toStrictEqual({ [innerName]: innerVersion });
});

test("getPackageDependencies with no package returns error", async () => {
  const name = "react";
  const version = "16.3.0";

  const packageGetter = presetPackageInfo({});

  try {
    await getPackageDependencies(name, version, packageGetter);
  } catch (err) {
    expect(err).toBeDefined();
  }
});

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
