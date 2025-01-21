export type PackageName = string;
export type PackageVersion = string;
export type PackageRange = string;

/**
 * The result of a package request against `https://registry.npmjs.org`. This is
 * a subset of the returned data, not a full representation, that contains
 * everything you will need to carry out the exercise.
 * https://github.com/npm/registry/blob/main/docs/responses/package-metadata.md
 * @example
 * {
 *   "name": "react",
 *   "versions": {
 *     "16.13.0": {
 *       "name": "react",
 *       "version": "16.13.0",
 *       "dependencies": {
 *         "loose-envify": "^1.1.0",
 *         "object-assign": "^4.1.1",
 *         "prop-types": "^15.6.2",
 *       }
 *     }
 *   }
 * }
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
