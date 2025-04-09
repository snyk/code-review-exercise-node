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

  // we use in memory cache for the dependencies why not using a redis for LRU with TTL or better a DB and invalidation of cache
  const dependenciesWithRange = packageForVersion?.dependencies ?? {};
  const dependencies: Record<PackageName, PackageVersion> = {};

  //this is not async, we can use Promise.all or Promise.allSettled .. as this is quite slow
  for (const [dependencyName, range] of Object.entries(dependenciesWithRange)) {
    const dependency: NPMPackage = await getPackage(dependencyName);

    const maxSatisfyingVersion =
      maxSatisfying(Object.keys(dependency.versions), range) ?? range;
    dependencies[dependencyName] = maxSatisfyingVersion;
  }

  return dependencies;
}

/*
    ** Naming Conventions:
        Inconsistent or unclear naming:

        packageGetter: This name could be more descriptive. Since it's a factory or function that provides a getter for packages, 
        a more descriptive name could be getPackageFetcher or packageFetcherFactory. 
        This would better communicate its purpose (fetching packages).

        getPackageDependencies: The name is clear, but it might be more specific if you make it a bit more descriptive like resolvePackageDependencies.
        The word "resolve" implies that you're not just fetching but also processing or selecting dependencies.

    ** Current Limitations in Logic:

      * Dependency Resolution for Unmatched Versions:

        The current logic uses the maxSatisfying function to resolve the highest version within the given version range. However, if no version satisfies the range, the fallback behavior is to return the original range itself (e.g., "^1.1.0"). This behavior may not be appropriate for all cases, as the consumer of this function may expect a concrete version number rather than a version range when no match is found.
        Missing Handling for Unresolved Dependencies: The logic currently does not account for the scenario where no matching version exists for a dependency's range, potentially resulting in incorrect or unintended behavior.

      * Error Handling for Missing Package Versions:

        When a version of a package is not found, the code throws a PackageVersionNotFoundError. While this is a valid error handling strategy, it may not be sufficient in all cases. For instance, if the getPackage function fails to fetch package data due to network issues or incomplete data, the current logic doesn't handle those cases gracefully.
        Lack of Retry or Graceful Fallback: The function doesn't implement a retry mechanism or fallback behavior for these cases, which could lead to unhandled errors in production.

      *Circular Dependencies:

        The current implementation does not handle circular dependencies. In scenarios where dependencies are mutually dependent (e.g., A -> B -> A), the function could enter an infinite loop, potentially causing a stack overflow or unexpected behavior.
        No Cycle Detection: The code does not include any mechanisms to detect and resolve circular dependencies, which could lead to infinite recursion.

      *Concurrent Dependency Resolution:

        The logic resolves dependencies one at a time using an await within a loop, which could cause significant performance issues, especially when handling a large number of dependencies.
        No Concurrent Resolution: The current implementation does not leverage concurrent resolution strategies (like Promise.all) to fetch dependencies in parallel, which could be more efficient.

      *Cache Handling:

        While the code mentions the use of an in-memory cache for dependencies, there is no actual caching logic implemented. As a result, the function will make repeated network or fetch calls for the same dependencies.
        Missing Cache Implementation: There is no caching of resolved dependencies, leading to redundant fetches for the same data, which could be inefficient and slow.


*/
