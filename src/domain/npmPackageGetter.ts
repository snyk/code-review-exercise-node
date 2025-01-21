import { NPMPackage, PackageName } from "./types";
import axios, { AxiosError } from "axios";
import pino from "pino";
import { PackageNotFoundError } from "./errors";

const logger = pino();

export const REGISTRY_URL = "https://registry.npmjs.org";

enum StatusCode {
  NotFound = 404,
}

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
