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
  name: string;
  versions: Record<string, PackageVersion>;
}

export interface PackageVersion {
  name: string;
  version: string;
  dependencies?: Record<string, string>;
}

export type PackageGetter = (name: string) => Promise<NPMPackage>;
