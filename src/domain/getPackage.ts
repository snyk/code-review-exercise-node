import { PackageVersionNotFoundError } from "./errors";
import { NPMPackage, PackageGetter } from "./types";
import { maxSatisfying } from "semver";

export async function getPackageDependencies(
  name: string,
  version: string,
  getPackage: PackageGetter,
): Promise<Record<string, string>> {
  const npmPackage: NPMPackage = await getPackage(name);

  if (!npmPackage.versions[version]) {
    throw new PackageVersionNotFoundError(name, version);
  }

  const packageDependencyRanges =
    npmPackage.versions[version]?.dependencies ?? {};
  const dependencies: Record<string, string> = {};

  for (const [name, range] of Object.entries(packageDependencyRanges)) {
    const subPackage: NPMPackage = await getPackage(name);

    dependencies[name] =
      maxSatisfying(Object.keys(subPackage.versions), range) ?? range;
  }

  return dependencies;
}
