export type PackageName = string;
export type PackageVersion = string;
export type PackageRange = string;

/**
 * A representation of an NPMPackage containing the
 * name of the package versions.
 * Versions is an object containing all available versions, with the version
 * being used as a key and the value being of type PackageWithDependencies.
 */
export interface NPMPackage {
  name: PackageName;
  versions: Record<PackageVersion, PackageWithDependencies>;
}

export interface PackageWithDependencies {
  name: PackageName;
  version: PackageVersion;
  dependencies?: Record<PackageName, PackageRange>;
}

export type PackageGetter = (packageName: PackageName) => Promise<NPMPackage>;
