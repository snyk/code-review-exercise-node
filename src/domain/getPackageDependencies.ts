import { PackageVersionNotFoundError } from "./errors";
import {
  NPMPackage,
  PackageGetter,
  PackageName,
  PackageVersion,
} from "./types";
import { maxSatisfying } from "semver";

/**
 * A function which resolves the direct dependencies of a
 * package with a given name and version.
 * The function accepts a PackageGetter, which is a function resolving
 *
 * The return value is a record with the dependencies, with the value being
 * the package name of the dependency and the value being the version of the
 *  corresponding dependency.
 *
 * @param  {[string]} packageName The name of the package
 * @param  {[string]} packageVersion The version of the package
 * @param  getPackage A function which resolves the name of a package to an NPMPackage.
 * @return {[Promise<Record<string, string>>]} Map of dependencies, entries contain `packageName: packageVersion`
 */
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
