import { NPMPackage, PackageName } from "./types";
import axios, { AxiosError } from "axios";
import pino from "pino";
import { PackageNotFoundError } from "./errors";

const logger = pino();

export const REGISTRY_URL = "https://registry.npmjs.org";

enum StatusCode {
  NotFound = 404,
}

/**
 * Fetches data about an npm package from the npm API and returns
 * a representation of those data back.
 *
 * This function relies on the fact that the result of a package request against `https://registry.npmjs.org`
 * has the following shape ( https://github.com/npm/registry/blob/main/docs/responses/package-metadata.md):
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
 * @param  {[string]} packageName The name of the npm package
 * @return {[Promise<NPMPackage>]} The representation of the NPM package. It contains
 * the name of the package and information about the available
 * versions of this package.
 */
export async function getNPMPackageByName(
  packageName: PackageName,
): Promise<NPMPackage> {
  try {
    const npmPackage: NPMPackage = (
      await axios.get(`${REGISTRY_URL}/${packageName}`)
    ).data;

    return npmPackage;
  } catch (error) {
    if (error instanceof AxiosError && error.status === StatusCode.NotFound) {
      throw new PackageNotFoundError(packageName);
    }

    logger.error({ error, packageName }, "Error when request package from NPM");
    throw error;
  }
}
