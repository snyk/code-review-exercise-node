import { PackageVersionNotFoundError } from "./errors";
import {
  NPMPackage,
  PackageGetter,
  PackageName,
  PackageVersion,
} from "./types";
import { maxSatisfying } from "semver";

export async function getPackageDependencies(
  packageName: PackageName,
  packageVersion: PackageVersion,
  getPackage: PackageGetter,
): Promise<Record<PackageName, PackageVersion>> {
  const npmPackage: NPMPackage = await getPackage(packageName);

  const packageForVersion = npmPackage.versions[packageVersion];
  if (!packageForVersion) {
    throw new PackageVersionNotFoundError(packageName, packageVersion);
  }

  const dependenciesWithRange = packageForVersion?.dependencies ?? {};
  const dependencies: Record<PackageName, PackageVersion> = {};

  for (const [dependencyName, range] of Object.entries(dependenciesWithRange)) {
    const dependency: NPMPackage = await getPackage(dependencyName);

    const maxSatisfyingVersion =
      maxSatisfying(Object.keys(dependency.versions), range) ?? range;
    dependencies[dependencyName] = maxSatisfyingVersion;
  }

  return dependencies;
}
